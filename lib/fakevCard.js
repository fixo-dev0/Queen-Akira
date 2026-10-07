// FIX: the old fake "status@broadcast" contact quote made WhatsApp show
// "You sent a message but your version of WhatsApp doesn't support it".
// It is kept only so old plugins still load; main.js removes it before sending.
module.exports = {
    fakevCard: {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            id: "QUEENAKIRA0000001"
        },
        message: {
            conversation: "© Qᴜᴇᴇɴ-ᴀᴋɪʀᴀ ᴏꜰꜰɪᴄɪᴀʟ"
        }
    }
};
