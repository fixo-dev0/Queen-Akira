const { cmd, commands } = require("../arslan");
const moment = require("moment-timezone");
const config = require("../config");

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

    const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363409660898486@newsletter",
            newsletterName: BOT,
            serverMessageId: 2,
        },
    };

    try {
        const B = global.baileys || {};
        const generateWAMessageFromContent = B.generateWAMessageFromContent;
        const prepareWAMessageMedia = B.prepareWAMessageMedia;
        const crypto = require("crypto");

        // Simple image menu (works on every WhatsApp). Set MENU_STYLE: 'image' in config.js to always use it.
        if (String(config.MENU_STYLE || "carousel").toLowerCase() === "image") throw new Error("image menu selected");

        // WhatsApp allows max 10 cards in one carousel
        const cats = Object.keys(grouped).sort().slice(0, 10);
        const cards = [];
        for (const cat of cats) {
            const media = await prepareWAMessageMedia(
                { image: { url: CATEGORY_IMAGES[cat] || DEFAULT_IMAGE } },
                { upload: conn.waUploadToServer }
            );
            const list = grouped[cat].sort().map(p => `• ${prefix}${p}`).join("\n");
            cards.push({
                header: { title: "", hasMediaAttachment: true, imageMessage: media.imageMessage },
                body: { text: `${CATEGORY_ICONS[cat] || "✨"} *${cat.toUpperCase()} MENU*\n\n${list}` },
                footer: { text: `${BOT} • ${grouped[cat].length} cmds` },
                nativeFlowMessage: {
                    buttons: [{
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({ display_text: "🏠 MAIN MENU", id: `${prefix}menu` }),
                    }],
                    messageParamsJson: "",
                },
            });
        }

        // FIX: no viewOnceMessage wrapper and no fake status quote — both made new
        // WhatsApp versions show "your version of WhatsApp doesn't support it".
        const msg = generateWAMessageFromContent(m.chat, {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
                messageSecret: crypto.randomBytes(32),
            },
            interactiveMessage: {
                body: { text: header },
                footer: { text: `${BOT} • POWERED BY FIXO-BAILEYS` },
                header: { title: "", hasMediaAttachment: false },
                carouselMessage: { cards, messageVersion: 1 },
                contextInfo,
            },
        }, { userJid: conn.user.id, quoted: mek });

        await conn.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id,
            additionalNodes: [{
                tag: "biz",
                attrs: {},
                content: [{
                    tag: "interactive",
                    attrs: { type: "native_flow", v: "1" },
                    content: [{ tag: "native_flow", attrs: { v: "9", name: "mixed" } }],
                }],
            }],
        });
    } catch (err) {
        // Fallback: plain image + text menu if cards are not supported
        console.error("Carousel menu failed, using text menu:", err && err.message);
        try {
            let text = header + "\n";
            for (const cat of Object.keys(grouped).sort()) {
                text += `\n${CATEGORY_ICONS[cat] || "✨"} *${cat.toUpperCase()} MENU*\n`;
                text += grouped[cat].sort().map(p => `• ${prefix}${p}`).join("\n") + "\n";
            }
            await conn.sendMessage(m.chat, { image: { url: DEFAULT_IMAGE }, caption: text.trim(), contextInfo }, { quoted: mek });
        } catch (e) {
            console.error("AllMenu Error:", e);
            reply("❌ Error while generating menu.");
        }
    }
});
