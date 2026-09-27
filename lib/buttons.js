// === lib/buttons.js ===
// Helper to send real, tappable WhatsApp "button menu" messages
// (native flow / quick_reply buttons) using Baileys.
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

const {
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = require('@fixo-baileyes');

/**
 * Sends a native "button menu" (quick_reply buttons) message.
 * Falls back to a normal numbered text list if button generation fails,
 * so the bot never goes silent on WhatsApp versions/clients that reject it.
 */
async function sendButtonMenu(conn, jid, { text, footer, image, buttons = [], quoted } = {}) {
    try {
        const nativeButtons = buttons.map((b) => ({
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
                display_text: b.text,
                id: b.id
            })
        }));

        let header = { hasMediaAttachment: false };
        if (image) {
            const media = await prepareWAMessageMedia(
                { image: typeof image === 'string' ? { url: image } : image },
                { upload: conn.waUploadToServer }
            );
            header = {
                hasMediaAttachment: true,
                ...media
            };
        }

        const msg = generateWAMessageFromContent(
            jid,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({ text: text || '' }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || '' }),
                            header: proto.Message.InteractiveMessage.Header.create(header),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: nativeButtons
                            })
                        })
                    }
                }
            },
            { quoted }
        );

        await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    } catch (err) {
        console.error('⚠️ Button menu failed, falling back to text list:', err.message);
        const fallback =
            (text ? text + '\n\n' : '') +
            buttons.map((b, i) => `➣ ${i + 1}. ${b.text}`).join('\n') +
            (footer ? `\n\n${footer}` : '');
        return conn.sendMessage(jid, { text: fallback }, { quoted });
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
