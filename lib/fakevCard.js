// Fake vCard quote (shows "© QUEEN-AKIRA OFFICIAL" contact above the bot reply).
// Uses a plain contactMessage only - no nested contextInfo / verifiedBizName,
// which is what made WhatsApp show "your version doesn't support it".
const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:© QUEEN-AKIRA OFFICIAL\nORG:QUEEN-AKIRA;\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002\nEND:VCARD';
module.exports = {
    get fakevCard() {
        return {
            key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', id: 'QA' + Date.now() },
            message: { contactMessage: { displayName: '© QUEEN-AKIRA OFFICIAL', vcard } }
        };
    }
};
