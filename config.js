const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

module.exports = {
    // ===========================================================
    // 1. CONFIGURATION DE BASE (Session & Database)
    // ===========================================================
    SESSION_ID: process.env.SESSION_ID || "MINI BOT", 
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://nima:nima@nimabot.gkpbhvh.mongodb.net',
    
    // ===========================================================
    // 2. INFORMATIONS DU BOT
    // ===========================================================
    PREFIX: process.env.PREFIX || '.',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '+94703945265', // Mettez votre numéro ici
    BOT_NAME: "𝙌𝙪𝙚𝙚𝙣 𝘼𝙠𝙞𝙧𝙖 𝙈𝙞𝙣𝙞",
    BOT_FOOTER: '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜰɪxᴏ ᴅᴇᴠ',
    
    // Mode de travail : public, private, group, inbox
    WORK_TYPE: process.env.WORK_TYPE || "public", 
    
    // ===========================================================
    // 3. FONCTIONNALITÉS AUTOMATIQUES (STATUTS)
    // ===========================================================
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true', // Voir automatiquement les statuts
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true', // Liker automatiquement les statuts
    AUTO_LIKE_EMOJI: ['❤️', '🌹', '✨', '🥰', '🌹', '😍', '💞', '💕', '☺️', '🤗'], 
    
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'false', // Répondre aux statuts
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || '🤗', // Message de réponse
    
    // ===========================================================
    // 4. FONCTIONNALITÉS DE CHAT & PRÉSENCE
    // ===========================================================
    READ_MESSAGE: process.env.READ_MESSAGE || 'false', // Marquer les messages comme lus (Blue Tick)
    AUTO_TYPING: process.env.AUTO_TYPING || 'false', // Afficher "Écrit..."
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false', // Afficher "Enregistre..."
    
    // ===========================================================
    // 5. GESTION DES GROUPES
    // ===========================================================
    WELCOME_ENABLE: process.env.WELCOME_ENABLE || 'true',
    GOODBYE_ENABLE: process.env.GOODBYE_ENABLE || 'true',
    WELCOME_MSG: process.env.WELCOME_MSG || null, 
    GOODBYE_MSG: process.env.GOODBYE_MSG || null, 
    WELCOME_IMAGE: process.env.WELCOME_IMAGE || null, 
    GOODBYE_IMAGE: process.env.GOODBYE_IMAGE || null,
    
    GROUP_INVITE_LINK: process.env.GROUP_INVITE_LINK || 'https://chat.whatsapp.com/GerP9z5N8VSIURa6NMAtYd?s=cl&p=a&mlu=4',
    
    // ===========================================================
    // 6. SÉCURITÉ & ANTI-CALL
    // ===========================================================
    ANTI_CALL: process.env.ANTI_CALL || 'false', // Rejeter les appels
    REJECT_MSG: process.env.REJECT_MSG || '*CALL LATER PLEASE ☺️🌹*',
    
    // ===========================================================
    // 7. IMAGES & LIENS
    // ===========================================================
    IMAGE_PATH: 'https://files.catbox.moe/kj4dyc.png',
    MENU_STYLE: process.env.MENU_STYLE || 'card', // 'card' = fixo-baileys card menu image, 'image' = simple image menu
    CHANNEL_JID: process.env.CHANNEL_JID || '120363409660898486@newsletter',
    CHANNEL_NAME: process.env.CHANNEL_NAME || '𝙌𝙪𝙚𝙚𝙣 𝘼𝙠𝙞𝙧𝙖',
    CHANNEL_FORWARD: process.env.CHANNEL_FORWARD || 'true', // 'false' = turn off forwarded-from-channel look // your channel id (120363xxxx@newsletter) for .channelstatus
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029Vb8c75l1SWstC9vY7c37',
    
    // ===========================================================
    // 8. EXTERNAL API (Optionnel)
    // ===========================================================
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8829618592:AAEUTrpbrwzIHoQrmBH-RkJQmbcbqoJSF1Y',
    TELEGRAM_CHAT_ID: process.env.  TELEGRAM_CHAT_ID || '8264584451'
    
};
  
