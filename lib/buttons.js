// === lib/buttons.js ===
// Helper to send the WhatsApp "button menu" message.
//
// NOTE (fix): this used to build a raw `interactiveMessage` /
// `nativeFlowMessage` ("fake native buttons") wrapped in a viewOnceMessage
// and push it straight through conn.relayMessage(). That is an unofficial
// protocol hack — current WhatsApp multi-device servers detect it as
// invalid/abusive traffic and don't just reject the message, they kill the
// whole socket. That's why .menu looked "active" but never replied, and the
// linked device got disconnected right after. Sending a plain message
// (text, or image+caption) is a normal, fully-supported operation and does
// not risk the connection.
//
// Usage:
//   const { sendButtonMenu } = require('../lib/buttons');
//   await sendButtonMenu(conn, from, {
//       text: "Choose an option 👇",
//       footer: "Queen Akira Mini",
//       image: "https://files.catbox.moe/kwwaun.png", // optional
//       buttons: [
//           { id: "menu_mode", text: "🌐 MODE" },
//           { id: "menu_statusview", text: "👁️ STATUS VIEW" },
//       ]
//   });

/**
 * Sends the menu as a plain, safe WhatsApp message (image+caption if an
 * image is given, otherwise text). "buttons" are rendered as a numbered
 * text list — the caller tells the user how to pick one (e.g. ".menu 3"
 * or ".menu owner") since there are no real tappable buttons anymore.
 */
async function sendButtonMenu(conn, jid, { text, footer, image, buttons = [], quoted } = {}) {
    const listText =
        (text ? text + '\n\n' : '') +
        buttons.map((b, i) => `➣ ${i + 1}. ${b.text}`).join('\n') +
        (footer ? `\n\n${footer}` : '');

    try {
        if (image) {
            return await conn.sendMessage(
                jid,
                { image: typeof image === 'string' ? { url: image } : image, caption: listText },
                { quoted }
            );
        }
        return await conn.sendMessage(jid, { text: listText }, { quoted });
    } catch (err) {
        console.error('⚠️ Menu send failed, falling back to text-only:', err.message);
        return conn.sendMessage(jid, { text: listText }, { quoted }).catch((e) =>
            console.error('⚠️ Menu fallback send also failed:', e.message)
        );
    }
}

/**
 * Reads an incoming message and, if it is a reply to a native flow button
 * (interactiveResponseMessage), returns the button id that was tapped.
 * Returns null for any other message type.
 */
function getClickedButtonId(message) {
    try {
        const interactive = message.message?.interactiveResponseMessage;
        if (!interactive) return null;
        const paramsJson = interactive.nativeFlowResponseMessage?.paramsJson;
        if (!paramsJson) return null;
        const parsed = JSON.parse(paramsJson);
        return parsed.id || null;
    } catch {
        return null;
    }
}

module.exports = { sendButtonMenu, getClickedButtonId };
