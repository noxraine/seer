import { getStore } from "@netlify/blobs";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function send(id, text, rows) {
  const body = { chat_id: id, text: text };
  if (rows) body.reply_markup = { inline_keyboard: rows };
  await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}

export default async () => {
  if (!TOKEN) return new Response("no token");
  const store = getStore("bot-users");
  const listed = await store.list();
  const now = Date.now();
  for (const blob of listed.blobs || []) {
    const user = await store.get(blob.key, { type: "json" });
    if (!user || user.permanent || user.muted || user.reminded) continue;
    if (user.until && now >= user.until - 12 * 3600000) {
      user.reminded = true;
      await store.setJSON(String(user.id), user);
      await send(user.id, "Your 3-day access ends today.\nWant to keep full access for free?", [
        [{ text: "Yes, extend", callback_data: "yes" }],
        [{ text: "No, thanks", callback_data: "no" }]
      ]);
    }
  }
  return new Response("ok");
};
