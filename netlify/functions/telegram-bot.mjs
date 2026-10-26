import { getStore } from "@netlify/blobs";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP = process.env.APP_URL || "https://saluki.netlify.app";
const ADMIN = process.env.ADMIN_CHAT_ID || "";
const DAY = 86400000;

function api(method, body) {
  return fetch("https://api.telegram.org/bot" + TOKEN + "/" + method, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}

function users() { return getStore("bot-users"); }
function keys() { return getStore("bot-keys"); }

async function load(id) {
  return (await users().get(String(id), { type: "json" })) || null;
}

async function save(user) {
  await users().setJSON(String(user.id), user);
  if (user.key) await keys().setJSON(user.key, { until: user.until });
}

function link(user) { return APP + "/?k=" + user.key; }

function key() { return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); }

async function send(id, text, rows) {
  const body = { chat_id: id, text: text };
  if (rows) body.reply_markup = { inline_keyboard: rows };
  await api("sendMessage", body);
}
async function notify(text) {
  if (ADMIN) await send(ADMIN, text);
}

function openButton(user, label) {
  return [[{ text: label, url: link(user) }]];
}

async function grant(user, until, permanent) {
  user.until = until;
  user.permanent = !!permanent;
  await save(user);
}

export default async (req) => {
  if (!TOKEN || req.method !== "POST") return new Response("ok");
  const update = await req.json();
  const msg = update.message;
  const cb = update.callback_query;

  if (cb) {
    const id = cb.from.id;
    const user = (await load(id)) || { id: id, key: key() };
    await api("answerCallbackQuery", { callback_query_id: cb.id });
    if (cb.data === "no") {
      user.muted = true;
      await save(user);
      await send(id, "Got it. We won’t message you again.");
    }
    if (cb.data === "yes") {
      user.waiting = "pay";
      await save(user);
      await send(id, "One short question for free access:\n\nDo you currently pay for any trading tools or signals?", [
        [{ text: "Yes, I pay", callback_data: "pay_yes" }],
        [{ text: "No, I don’t", callback_data: "pay_no" }]
      ]);
    }
    if (cb.data === "pay_yes" || cb.data === "pay_no") {
      user.answer = cb.data === "pay_yes" ? "yes" : "no";
      user.waiting = "";
      await grant(user, Date.now() + 3650 * DAY, true);
      await send(id, "Thanks. Full access is now open.", openButton(user, "Open Saluki Terminal"));
      await notify("Answer: " + user.answer + "\nid: " + id);
    }
    return new Response("ok");
  }

  if (!msg || !msg.from) return new Response("ok");
  const id = msg.from.id;
  const text = (msg.text || "").trim();
  let user = await load(id);

  if (text === "/start" && !user) {
    user = { id: id, key: key(), startedAt: Date.now(), until: Date.now() + 3 * DAY, permanent: false, reminded: false, muted: false };
    await save(user);
    await send(id, "Thanks for trying Saluki Terminal.\nYou have full access for 3 days.", openButton(user, "Back to Saluki Terminal"));
    await notify("New start\nid: " + id + "\nname: " + (msg.from.username ? "@" + msg.from.username : msg.from.first_name || ""));
    return new Response("ok");
  }

  if (!user) {
    user = { id: id, key: key(), startedAt: Date.now(), until: 0, permanent: false, reminded: false, muted: false };
    await save(user);
  }

  if (user.waiting === "help" && text && text[0] !== "/") {
    user.waiting = "";
    user.lastHelp = text;
    await save(user);
    await send(id, "Thanks, we received it. We’ll look into it.");
    await notify("Help from " + id + "\n" + text + "\nReply: /msg " + id + " your text");
    return new Response("ok");
  }

  if (text === "/help" || text === "Get help") {
    user.waiting = "help";
    await save(user);
    await send(id, "Please describe the problem in as much detail as you can.");
    return new Response("ok");
  }

  if (text === "/access" || text === "Get full access") {
    if (user.answer) {
      await send(id, "Full access is already open.", openButton(user, "Open Saluki Terminal"));
    } else {
      user.waiting = "pay";
      await save(user);
      await send(id, "One short question for free access:\n\nDo you currently pay for any trading tools or signals?", [
        [{ text: "Yes, I pay", callback_data: "pay_yes" }],
        [{ text: "No, I don’t", callback_data: "pay_no" }]
      ]);
    }
    return new Response("ok");
  }

  if (!user.permanent && !user.muted && !user.reminded && user.until && Date.now() >= user.until - 12 * 3600000) {
    user.reminded = true;
    await save(user);
    await send(id, "Your 3-day access ends today.\nWant to keep full access for free?", [
      [{ text: "Yes, extend", callback_data: "yes" }],
      [{ text: "No, thanks", callback_data: "no" }]
    ]);
    return new Response("ok");
  }
  if (String(id) === String(ADMIN) && text.indexOf("/msg ") === 0) {
    const parts = text.split(" ");
    const to = parts[1];
    const body = parts.slice(2).join(" ");
    if (to && body) await send(to, body);
    await send(id, body ? "Sent to " + to : "Use /msg 123456 text");
    return new Response("ok");
  }
  if (text === "/start") {
    await send(id, "Saluki Terminal is ready.", openButton(user, "Open Saluki Terminal"));
  }
  return new Response("ok");
};
