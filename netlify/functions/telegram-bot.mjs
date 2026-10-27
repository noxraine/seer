import { getStore } from "@netlify/blobs";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP = process.env.APP_URL || "https://saluki.netlify.app";
const ADMIN = process.env.ADMIN_CHAT_ID || "";
const DAY = 86400000;
const LANGS = ["en", "hi", "es", "fr", "ru"];

const T = {
  en: {
    help: "❓ Get help", access: "🔓 Get full access", lang: "🌐 Language",
    open: "📈 Open Saluki Terminal", yesPay: "✅ Yes, I pay", noPay: "❌ No, I don’t",
    yes: "✅ Yes, extend", no: "❌ No, thanks",
    choose: "<b>🌐 Choose your language</b>\n\nYou can change it later with the Language button.",
    set: "<b>🌐 Language set</b>\n\nEnglish is on.",
    start: "<b>🟢 Saluki Terminal</b>\n\n<b>3 days of full access are open.</b>\n\nWe do not tell you when to trade.\nWe tell you when <b>NOT</b> to trade.\n\nOpen the terminal and keep it next to your chart.",
    ready: "<b>🟢 Saluki Terminal is ready</b>\n\nUse the buttons below anytime.",
    helpAsk: "<b>❓ Help</b>\n\nDescribe the problem in as much detail as you can.\nPrice, pair, and what you expected to see.",
    helpDone: "<b>✅ Received</b>\n\nWe have it. We’ll look into it.",
    openAlready: "<b>🔓 Full access is open</b>\n\nAll pairs are unlocked.",
    question: "<b>🟡 One question for free access</b>\n\nDo you currently pay for any trading tools or signals?",
    thanks: "<b>🔓 Full access is open</b>\n\nThanks. All pairs are unlocked.",
    ends: "<b>🟡 Access ends today</b>\n\nWant to keep full access for free?",
    muted: "<b>Understood</b>\n\nWe won’t message you again."
  },
  hi: {
    help: "❓ मदद लें", access: "🔓 पूरा एक्सेस", lang: "🌐 भाषा",
    open: "📈 Saluki Terminal खोलें", yesPay: "✅ हाँ, मैं भुगतान करता हूँ", noPay: "❌ नहीं",
    yes: "✅ हाँ, बढ़ाएँ", no: "❌ नहीं, धन्यवाद",
    choose: "<b>🌐 अपनी भाषा चुनें</b>\n\nबाद में Language बटन से बदल सकते हैं।",
    set: "<b>🌐 भाषा सेट हो गई</b>\n\nहिन्दी चालू है।",
    start: "<b>🟢 Saluki Terminal</b>\n\n<b>3 दिन का पूरा एक्सेस खुला है।</b>\n\nहम नहीं बताते कब ट्रेड करना है।\nहम बताते हैं कब <b>नहीं</b> करना है।\n\nटर्मिनल खोलें और चार्ट के पास रखें।",
    ready: "<b>🟢 Saluki Terminal तैयार है</b>\n\nनीचे के बटन कभी भी इस्तेमाल करें।",
    helpAsk: "<b>❓ मदद</b>\n\nसमस्या जितना हो सके विस्तार से लिखें।\nकीमत, पेयर, और आपने क्या देखने की उम्मीद की थी।",
    helpDone: "<b>✅ मिल गया</b>\n\nहमने नोट कर लिया। हम देखेंगे।",
    openAlready: "<b>🔓 पूरा एक्सेस खुला है</b>\n\nसभी पेयर अनलॉक हैं।",
    question: "<b>🟡 मुफ्त एक्सेस के लिए एक सवाल</b>\n\nक्या आप अभी किसी ट्रेडिंग टूल या सिग्नल के लिए भुगतान करते हैं?",
    thanks: "<b>🔓 पूरा एक्सेस खुला है</b>\n\nधन्यवाद। सभी पेयर अनलॉक हैं।",
    ends: "<b>🟡 एक्सेस आज खत्म होता है</b>\n\nमुफ्त में पूरा एक्सेस रखना है?",
    muted: "<b>समझ गए</b>\n\nहम आपको फिर संदेश नहीं भेजेंगे।"
  },
  es: {
    help: "❓ Obtener ayuda", access: "🔓 Acceso completo", lang: "🌐 Idioma",
    open: "📈 Abrir Saluki Terminal", yesPay: "✅ Sí, pago", noPay: "❌ No pago",
    yes: "✅ Sí, ampliar", no: "❌ No, gracias",
    choose: "<b>🌐 Elige tu idioma</b>\n\nPuedes cambiarlo luego con el botón Idioma.",
    set: "<b>🌐 Idioma listo</b>\n\nEspañol activado.",
    start: "<b>🟢 Saluki Terminal</b>\n\n<b>Tienes 3 días de acceso completo.</b>\n\nNo te decimos cuándo operar.\nTe decimos cuándo <b>NO</b> operar.\n\nAbre el terminal y déjalo junto a tu gráfico.",
    ready: "<b>🟢 Saluki Terminal está listo</b>\n\nUsa los botones de abajo cuando quieras.",
    helpAsk: "<b>❓ Ayuda</b>\n\nDescribe el problema con el mayor detalle posible.\nPrecio, par y qué esperabas ver.",
    helpDone: "<b>✅ Recibido</b>\n\nLo tenemos. Lo revisaremos.",
    openAlready: "<b>🔓 El acceso completo está abierto</b>\n\nTodos los pares están desbloqueados.",
    question: "<b>🟡 Una pregunta para el acceso gratis</b>\n\n¿Pagas ahora por alguna herramienta o señal de trading?",
    thanks: "<b>🔓 El acceso completo está abierto</b>\n\nGracias. Todos los pares están desbloqueados.",
    ends: "<b>🟡 El acceso termina hoy</b>\n\n¿Quieres mantener el acceso completo gratis?",
    muted: "<b>Entendido</b>\n\nNo te volveremos a escribir."
  },
  fr: {
    help: "❓ Obtenir de l’aide", access: "🔓 Accès complet", lang: "🌐 Langue",
    open: "📈 Ouvrir Saluki Terminal", yesPay: "✅ Oui, je paie", noPay: "❌ Non",
    yes: "✅ Oui, prolonger", no: "❌ Non, merci",
    choose: "<b>🌐 Choisissez votre langue</b>\n\nVous pourrez la changer avec le bouton Langue.",
    set: "<b>🌐 Langue enregistrée</b>\n\nFrançais activé.",
    start: "<b>🟢 Saluki Terminal</b>\n\n<b>3 jours d’accès complet sont ouverts.</b>\n\nNous ne disons pas quand trader.\nNous disons quand <b>NE PAS</b> trader.\n\nOuvrez le terminal et gardez-le près de votre graphique.",
    ready: "<b>🟢 Saluki Terminal est prêt</b>\n\nUtilisez les boutons ci-dessous à tout moment.",
    helpAsk: "<b>❓ Aide</b>\n\nDécrivez le problème avec autant de détails que possible.\nPrix, paire, et ce que vous attendiez.",
    helpDone: "<b>✅ Reçu</b>\n\nNous l’avons. Nous regardons.",
    openAlready: "<b>🔓 L’accès complet est ouvert</b>\n\nToutes les paires sont débloquées.",
    question: "<b>🟡 Une question pour l’accès gratuit</b>\n\nPayez-vous actuellement un outil ou des signaux de trading ?",
    thanks: "<b>🔓 L’accès complet est ouvert</b>\n\nMerci. Toutes les paires sont débloquées.",
    ends: "<b>🟡 L’accès se termine aujourd’hui</b>\n\nVoulez-vous garder l’accès complet gratuitement ?",
    muted: "<b>Compris</b>\n\nNous ne vous écrirons plus."
  },
  ru: {
    help: "❓ Получить помощь", access: "🔓 Полный доступ", lang: "🌐 Язык",
    open: "📈 Открыть Saluki Terminal", yesPay: "✅ Да, плачу", noPay: "❌ Нет",
    yes: "✅ Да, продлить", no: "❌ Нет, спасибо",
    choose: "<b>🌐 Выберите язык</b>\n\nПозже его можно сменить кнопкой Язык.",
    set: "<b>🌐 Язык выбран</b>\n\nРусский включён.",
    start: "<b>🟢 Saluki Terminal</b>\n\n<b>Полный доступ открыт на 3 дня.</b>\n\nМы не говорим, когда торговать.\nМы говорим, когда <b>НЕ</b> торговать.\n\nОткройте терминал и держите его рядом с графиком.",
    ready: "<b>🟢 Saluki Terminal готов</b>\n\nКнопки внизу всегда под рукой.",
    helpAsk: "<b>❓ Помощь</b>\n\nОпишите проблему как можно подробнее.\nЦена, пара и что вы ожидали увидеть.",
    helpDone: "<b>✅ Получили</b>\n\nМы посмотрим.",
    openAlready: "<b>🔓 Полный доступ открыт</b>\n\nВсе пары разблокированы.",
    question: "<b>🟡 Один вопрос для бесплатного доступа</b>\n\nВы сейчас платите за какие-либо торговые инструменты или сигналы?",
    thanks: "<b>🔓 Полный доступ открыт</b>\n\nСпасибо. Все пары разблокированы.",
    ends: "<b>🟡 Доступ заканчивается сегодня</b>\n\nХотите оставить полный доступ бесплатно?",
    muted: "<b>Поняли</b>\n\nБольше не будем писать."
  }
};

function tr(lang) { return T[lang] || T.en; }
function menu(lang) {
  const t = tr(lang);
  return { keyboard: [[{ text: t.help }, { text: t.access }], [{ text: t.lang }]], resize_keyboard: true, is_persistent: true };
}
function langButtons() {
  return [[
    { text: "🇬🇧 English", callback_data: "lang_en" },
    { text: "🇮🇳 हिन्दी", callback_data: "lang_hi" }
  ], [
    { text: "🇪🇸 Español", callback_data: "lang_es" },
    { text: "🇫🇷 Français", callback_data: "lang_fr" }
  ], [
    { text: "🇷🇺 Русский", callback_data: "lang_ru" }
  ]];
}
function isBtn(text, key) {
  return LANGS.some(function (code) { return T[code][key] === text; });
}
function langOf(text) {
  for (var i = 0; i < LANGS.length; i++) {
    var code = LANGS[i];
    if (T[code].help === text || T[code].access === text || T[code].lang === text) return code;
  }
  return "";
}
function esc(s) {
  return String(s || "").replace(/&/g, "&"+"amp;").replace(/</g, "&"+"lt;").replace(/>/g, "&"+"gt;");
}

function api(method, body) {
  return fetch("https://api.telegram.org/bot" + TOKEN + "/" + method, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}
function users() { return getStore("bot-users"); }
function keys() { return getStore("bot-keys"); }
async function load(id) { return (await users().get(String(id), { type: "json" })) || null; }
async function save(user) {
  await users().setJSON(String(user.id), user);
  if (user.key) await keys().setJSON(user.key, { until: user.until });
}
function link(user) { return APP + "/?k=" + user.key; }
function freshKey() { return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); }

async function send(id, text, markup) {
  const body = { chat_id: id, text: text, parse_mode: "HTML" };
  if (markup) body.reply_markup = markup;
  await api("sendMessage", body);
}
async function notify(text) { if (ADMIN) await send(ADMIN, text); }
function openButton(user, label) { return { inline_keyboard: [[{ text: label, url: link(user) }]] }; }

async function showLang(id) { await send(id, T.en.choose, { inline_keyboard: langButtons() }); }
async function showMenu(id, lang) { await send(id, tr(lang).ready, menu(lang)); }

export default async (req) => {
  if (!TOKEN || req.method !== "POST") return new Response("ok");
  const update = await req.json();
  const msg = update.message;
  const cb = update.callback_query;

  if (cb) {
    const id = cb.from.id;
    const user = (await load(id)) || { id: id, key: freshKey() };
    const lang = user.lang || "en";
    await api("answerCallbackQuery", { callback_query_id: cb.id });
    if (cb.data && cb.data.indexOf("lang_") === 0) {
      const next = cb.data.slice(5);
      user.lang = LANGS.indexOf(next) === -1 ? "en" : next;
      const first = !user.startedAt;
      if (first) {
        user.startedAt = Date.now();
        user.until = Date.now() + 3 * DAY;
        user.permanent = false;
        user.reminded = false;
        user.muted = false;
      }
      await save(user);
      await send(id, tr(user.lang).set);
      if (first) {
        await send(id, tr(user.lang).start, openButton(user, tr(user.lang).open));
        await notify("New start\nid: " + id + "\nlang: " + user.lang + "\nname: " + (cb.from.username ? "@" + cb.from.username : cb.from.first_name || ""));
      }
      await showMenu(id, user.lang);
      return new Response("ok");
    }
    if (cb.data === "no") {
      user.muted = true;
      await save(user);
      await send(id, tr(lang).muted, menu(lang));
    }
    if (cb.data === "yes") {
      user.waiting = "pay";
      await save(user);
      await send(id, tr(lang).question, { inline_keyboard: [[{ text: tr(lang).yesPay, callback_data: "pay_yes" }], [{ text: tr(lang).noPay, callback_data: "pay_no" }]] });
    }
    if (cb.data === "pay_yes" || cb.data === "pay_no") {
      user.answer = cb.data === "pay_yes" ? "yes" : "no";
      user.waiting = "";
      user.until = Date.now() + 3650 * DAY;
      user.permanent = true;
      await save(user);
      await send(id, tr(lang).thanks, openButton(user, tr(lang).open));
      await notify("Answer: " + user.answer + "\nid: " + id);
    }
    return new Response("ok");
  }

  if (!msg || !msg.from) return new Response("ok");
  const id = msg.from.id;
  const text = (msg.text || "").trim();
  let user = await load(id);

  if (text === "/start" && (!user || !user.lang)) {
    if (!user) {
      user = { id: id, key: freshKey() };
      await save(user);
    }
    await showLang(id);
    return new Response("ok");
  }
  if (!user) {
    user = { id: id, key: freshKey() };
    await save(user);
    await showLang(id);
    return new Response("ok");
  }
  if (!user.lang) {
    await showLang(id);
    return new Response("ok");
  }
  var lang = user.lang;

  var fromBtn = langOf(text);
  if (fromBtn && fromBtn !== lang) {
    user.lang = fromBtn;
    lang = fromBtn;
    await save(user);
  }
  if (isBtn(text, "lang")) {
    await showLang(id);
    return new Response("ok");
  }
  if (text === "/help" || isBtn(text, "help")) {
    user.waiting = "help";
    user.lang = lang;
    await save(user);
    await send(id, tr(lang).helpAsk, menu(lang));
    return new Response("ok");
  }
  if (text && text[0] !== "/" && !isBtn(text, "access") && !isBtn(text, "lang")) {
    user.waiting = "";
    user.lastHelp = text;
    await save(user);
    await send(id, tr(lang).helpDone, menu(lang));
    await notify("Help from " + id + "\n" + esc(text) + "\nReply: /msg " + id + " your text");
    return new Response("ok");
  }
  if (text === "/access" || isBtn(text, "access")) {
    if (user.answer || user.permanent) {
      await send(id, tr(lang).openAlready, openButton(user, tr(lang).open));
    } else {
      user.waiting = "pay";
      await save(user);
      await send(id, tr(lang).question, { inline_keyboard: [[{ text: tr(lang).yesPay, callback_data: "pay_yes" }], [{ text: tr(lang).noPay, callback_data: "pay_no" }]] });
    }
    return new Response("ok");
  }
  if (!user.permanent && !user.muted && !user.reminded && user.until && Date.now() >= user.until - 12 * 3600000) {
    user.reminded = true;
    await save(user);
    await send(id, tr(lang).ends, { inline_keyboard: [[{ text: tr(lang).yes, callback_data: "yes" }], [{ text: tr(lang).no, callback_data: "no" }]] });
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
    await send(id, tr(lang).ready, openButton(user, tr(lang).open));
    await showMenu(id, lang);
  }
  return new Response("ok");
};
