const { cmd } = require("../arslan");
const config = require("../config");
const { buildContent } = require("./groupstatus");

// Find the channel id from: 120363...@newsletter, a channel link, or config.CHANNEL_JID / CHANNEL_LINK
async function resolveChannel(conn, input) {
    let v = (input || config.CHANNEL_JID || config.CHANNEL_LINK || "").trim();
    if (/@newsletter$/.test(v)) return v;
    const code = (v.match(/channel\/([A-Za-z0-9]+)/) || [])[1] || (/^[A-Za-z0-9]{15,}$/.test(v) ? v : null);
    if (!code) return null;
    const meta = await conn.newsletterMetadata("invite", code);
    return meta && meta.id;
}

// .channelstatus [channel link/jid |] text   (or reply to image/video/voice/sticker)
cmd({
    pattern: "channelstatus",
    alias: ["chstatus", "cstatus", "channelpost"],
    desc: "Post a status to your WhatsApp channel (bot must be channel owner/admin)",
    category: "owner",
    react: "📣",
    filename: __filename
}, async (conn, mek, m, { q, isOwner, reply }) => {
    try {
        if (!isOwner) return reply("❌ Owner only.");
        let target = "", text = q || "";
        if (text.includes("|")) { [target, text] = text.split("|").map(s => s.trim()); }
        else if (/whatsapp\.com\/channel\/|@newsletter/.test(text.split(" ")[0] || "")) { target = text.split(" ")[0]; text = text.split(" ").slice(1).join(" "); }
        const jid = await resolveChannel(conn, target);
        if (!jid) return reply("❌ Channel not found. Use:\n.channelstatus https://whatsapp.com/channel/XXXX | Hello\nor set CHANNEL_JID in config.js");
        const content = await buildContent(m, text);
        if (!content) return reply("❌ Reply to media or type text.\nExample: .channelstatus Good morning ☀️");
        const res = await conn.sendChannelStatus(jid, content);
        return reply(`✅ Posted to channel.\n🆔 ${jid}${res && res.serverId ? "\n📨 " + res.serverId : ""}`);
    } catch (err) {
        const msg = String(err && err.message);
        if (/403/.test(msg)) return reply("❌ This WhatsApp number is not owner/admin of that channel.");
        return reply(`❌ Channel status failed: ${msg}`);
    }
});
