const {
    proto,
    getContentType,
    jidNormalizedUser,
    downloadContentFromMessage
} = global.baileys;

const sms = (conn, m) => {
    if (!m) return m;
    let M = proto.WebMessageInfo;
    
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = jidNormalizedUser(m.fromMe ? conn.user.id : (m.participant ? m.participant : m.key.participant ? m.key.participant : m.chat));
    }
    
    if (m.message) {
        m.mtype = getContentType(m.message);
        
        // Gestion ViewOnce / Ephemeral
        if (m.mtype === 'viewOnceMessageV2' || m.mtype === 'viewOnceMessage') {
             m.message = m.message[m.mtype].message;
             m.mtype = getContentType(m.message);
        }
        
        m.msg = m.message[m.mtype];
        // QUOTED MESSAGE
// FIX: full quoted object (mtype, text, sender, download) so .vv, .groupstatus, .hidetag etc. work
const _ctx = m.msg?.contextInfo;
if (_ctx?.quotedMessage) {
    let qm = _ctx.quotedMessage;
    let qt = getContentType(qm);
    if (qt === 'viewOnceMessageV2' || qt === 'viewOnceMessage' || qt === 'ephemeralMessage') { qm = qm[qt].message; qt = getContentType(qm); }
    const qmsg = qm[qt] || {};
    m.quoted = {
        ...qm,
        message: qm,
        mtype: qt,
        type: qt,
        msg: qmsg,
        mimetype: qmsg.mimetype || '',
        text: typeof qmsg === 'string' ? qmsg : (qmsg.text || qmsg.caption || qmsg.conversation || ''),
        stanzaId: _ctx.stanzaId,
        id: _ctx.stanzaId,
        participant: _ctx.participant,
        sender: jidNormalizedUser(_ctx.participant || m.chat),
        key: { remoteJid: m.chat, id: _ctx.stanzaId, participant: _ctx.participant, fromMe: jidNormalizedUser(_ctx.participant || '') === jidNormalizedUser(conn.user.id) },
        download: async () => {
            const kind = qt.replace(/Message$/, '');
            const stream = await downloadContentFromMessage(qmsg, kind === 'sticker' ? 'sticker' : kind);
            let buf = Buffer.from([]);
            for await (const c of stream) buf = Buffer.concat([buf, c]);
            return buf;
        }
    };
} else {
    m.quoted = null;
}
        
        // Récupération du texte (body)
        m.body = (m.mtype === 'conversation') ? m.message.conversation : 
                 (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : 
                 (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : 
                 (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                 (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : 
                 (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
                 (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : 
                 (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '';
                 
        // Alias pour répondre facilement
        m.reply = (text, chatId = m.chat, options = {}) => {
            return conn.sendMessage(chatId, { text: text }, { quoted: m, ...options });
        };
    }
    return m;
};

module.exports = { sms };
                
                                             
// ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʀꜱʟᴀɴ-ᴍᴅ                             
