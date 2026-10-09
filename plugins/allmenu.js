const { cmd, commands } = require("../arslan");
const moment = require("moment-timezone");
const config = require("../config");
const { fakevCard } = require("../lib/fakevCard");

// Card image per category (falls back to the default image). Put your own banners here.
const CATEGORY_IMAGES = {
    // group: "https://files.catbox.moe/xxxx.png",
    // settings: "https://files.catbox.moe/yyyy.png",
};
const DEFAULT_IMAGE = config.IMAGE_PATH || "https://files.catbox.moe/kj4dyc.png";
const SITE_URL = config.WEBSITE || "https://whatsapp.com/channel/0029Vb6";
const BOT = "𝙌𝙪𝙚𝙚𝙣 𝘼𝙠𝙞𝙧𝙖";

const CATEGORY_ICONS = {
    group: "👥", settings: "⚙️", owner: "👑", download: "📥", downloader: "📥",
    main: "🏠", system: "🧩", tools: "🛠️", fun: "🎉", search: "🔎",
    convert: "🔄", ai: "🤖", misc: "📦", other: "📦", media: "🎬",
};

function greeting() {
    const h = Number(moment().tz("Asia/Colombo").format("HH"));
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    if (h < 21) return "Good Evening";
    return "Good Night";
}

function uptime() {
    let s = Math.floor(process.uptime());
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    return `${d}d ${h}h ${m}m ${s}s`;
}

cmd({
    pattern: "menu",
    alias: ["commandlist", "allmenu", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    filename: __filename,
}, async (conn, mek, m, { reply, pushname }) => {
    const prefix = config.PREFIX || ".";
    const mode = String(config.MODE || config.WORK_TYPE || "public").toUpperCase();

    // Group commands by category
    let total = 0;
    const grouped = {};
    for (const c of commands) {
        if (!c.pattern || !c.category || c.dontAddCommandList) continue;
        total++;
        const cat = String(c.category).toLowerCase();
        (grouped[cat] = grouped[cat] || []).push(c.pattern);
    }

    const name = pushname || m.pushName || "User";
    const header =
`╭───〔 *${BOT}* 〕───◇
│ ${greeting()}, ${name}
│
│ ❯ *PREFIX* : ${prefix}
│ ❯ *MODE*   : ${mode}
│ ❯ *CMDS*   : ${total}
│ ❯ *UPTIME* : ${uptime()}
╰──────────────────◇

👉 Swipe the cards to open a category.
🌐 ${SITE_URL}`;

    // Original style: image + menu text, quoted with the fake vCard,
    // "Forwarded from channel" look is added automatically in main.js
    const cats = Object.keys(grouped).sort();
    let list = header.replace("👉 Swipe the cards to open a category.", "👇 All commands") + "\n";
    for (const cat of cats) {
        list += `\n╭─〔 ${CATEGORY_ICONS[cat] || "✨"} *${cat.toUpperCase()} MENU* 〕\n`;
        list += grouped[cat].sort().map(p => `│ ➤ ${prefix}${p}`).join("\n") + "\n╰──────────◇\n";
    }
    list += `\n> ${config.BOT_FOOTER || "© Powered by " + BOT}`;
    try {
        await conn.sendMessage(m.chat, { image: { url: DEFAULT_IMAGE }, caption: list.trim(), mentions: [m.sender] }, { quoted: fakevCard });
    } catch (e) {
        console.error("Menu image failed:", e && e.message);
        await conn.sendMessage(m.chat, { text: list.trim(), mentions: [m.sender] }, { quoted: fakevCard });
    }
});
