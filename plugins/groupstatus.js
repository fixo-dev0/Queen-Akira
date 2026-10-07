const { cmd } = require("../arslan");

// Builds status content from the replied message (or text after the command)
async function buildContent(m, text) {
    const q = m.quoted;
    if (!q) return text ? { text, backgroundColor: "#8A2BE2", font: 2 } : null;
    const t = q.mtype;
    if (t === "conversation" || t === "extendedTextMessage") return { text: text || q.text, backgroundColor: "#8A2BE2", font: 2 };
    const media = await q.download();
    if (t === "imageMessage") return { image: media, caption: text || q.text || "" };
    if (t === "videoMessage") return { video: media, caption: text || q.text || "" };
    if (t === "audioMessage") return { audio: media, mimetype: "audio/ogg; codecs=opus", ptt: true };
    if (t === "stickerMessage") return { sticker: media };
    return null;
}

// .groupstatus -> posts a real WhatsApp "group status" (story) inside this group
cmd({
    pattern: "groupstatus",
    alias: ["gstatus", "gcstatus", "groupstory"],
    desc: "Post a group status in this group (reply to image/video/audio or give text)",
    category: "group",
    react: "📡",
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, isAdmins, isOwner, reply }) => {
    try {
        if (!isGroup) return reply("❌ Use this command inside a group.");
        if (!isAdmins && !isOwner) return reply("❌ Only group admins can post a group status.");
        const content = await buildContent(m, q);
        if (!content) return reply("❌ Reply to an image / video / voice / sticker, or type text.\n\nExample: .groupstatus Hello everyone");
        await conn.sendMessage(from, { groupStatusMessage: content });
        return reply("✅ Group status posted.");
    } catch (err) {
        console.log("GROUPSTATUS ERROR:", err);
        return reply(`❌ Group status failed: ${err.message}`);
    }
});

// .mystatus -> posts to the bot's own WhatsApp status
cmd({
    pattern: "mystatus",
    alias: ["poststatus", "statuspost", "setstatus"],
    desc: "Post to the bot's own WhatsApp status",
    category: "owner",
    react: "🟢",
    filename: __filename
}, async (conn, mek, m, { q, isOwner, reply }) => {
    try {
        if (!isOwner) return reply("❌ Owner only.");
        const content = await buildContent(m, q);
        if (!content) return reply("❌ Reply to media or type text. Example: .mystatus Hello");
        let jids = [];
        try {
            const groups = await conn.groupFetchAllParticipating();
            for (const g of Object.values(groups)) for (const p of g.participants || []) jids.push(p.id);
        } catch (_) {}
        jids.push(conn.decodeJid(conn.user.id));
        jids = [...new Set(jids)].slice(0, 500);
        await conn.sendMessage("status@broadcast", content, { statusJidList: jids, backgroundColor: content.backgroundColor, font: content.font });
        return reply("✅ Status posted.");
    } catch (err) {
        return reply(`❌ Status failed: ${err.message}`);
    }
});

module.exports = { buildContent };
