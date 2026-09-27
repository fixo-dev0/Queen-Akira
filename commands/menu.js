// === menu.js ===
const NEWSLETTER_JID = "120363409660898486@newsletter";
const NEWSLETTER_NAME = "𝙌𝙪𝙚𝙚𝙣 𝘼𝙠𝙞𝙧𝙖 🕊️";
const menuImage = 'https://files.catbox.moe/kwwaun.png';

const botName = "𝙌𝙪𝙚𝙚𝙣 𝘼𝙠𝙞𝙧𝙖 𝙈𝙞𝙣𝙞 🕊️𓆪";
const ownerName = "𝙵𝙸𝚇𝙾 𝙳𝚎𝚅";
const version = "1.0";
const platform = "𝙏𝙚𝙡𝙚𝙜𝙧𝙖𝙢";

// ── category id -> { title, emoji, list } ────────────────────────────
// `list` items are appended after the prefix, e.g. "public" -> ".public"
const CATEGORIES = {
    owner: {
        title: "👑 OWNER MENU",
        list: ["public", "self", "block", "unblock", "broadcast", "setppbot", "autobio", "addowner", "delowner", "addprem", "delprem", "runtime", "speed", "getpp", "autopresence", "autorecording", "autotyping", "setprefix", "cleartmp", "restart", "savestatus", "autoread", "autoviewstatus", "autolikestatus", "fixowner", "ccgen"]
    },
    group: {
        title: "👥 GROUP MENU",
        list: ["add", "kick", "kickall", "kickadmins", "promote", "demote", "promoteall", "demoteall", "tagall", "hidetag", "tag", "groupjid", "listadmin", "listonline", "mute", "unmute", "linkgc", "resetlink", "poll", "del", "join", "leave", "creategc", "antilink", "antispam", "antibadword", "antibot", "antibill", "welcome", "goodbye", "protect", "antihijack", "opengroup", "closegroup", "opentime", "closetime", "setdesc", "setname", "setppgc", "warn", "resetwarn", "welcomecard", "antidelete", "antideletedm", "chatbot", "clearchatbot", "checkadmin"]
    },
    download: {
        title: "📥 DOWNLOAD MENU",
        list: ["play", "spotify", "ytmp3", "ytmp4", "tiktok", "instagram", "facebook", "twitter", "threads", "capcut", "mediafire", "apk", "pinterest", "tomp3", "tomp4"]
    },
    ai: {
        title: "🤖 AI MENU",
        list: ["ai", "chatgpt", "gpt", "gemini", "llama", "deepseek", "mistral", "groq", "flux", "pixart", "sdxl", "pollinations", "playground", "aidetect"]
    },
    tools: {
        title: "🛠️ TOOLS MENU",
        list: ["currency", "convert", "translate", "tr", "calc", "calculate", "tts", "tourl", "tinyurl", "shorturl", "tovn", "readmore", "removebg", "nobg", "enhance", "remini", "upscale", "hdr", "dehaze", "recolor", "blur", "toanime", "cartoon", "carbon", "jail", "gun", "qr", "qrcode", "readqr", "book", "bookcover", "obfuscate", "obf", "lyrics", "imdb", "movie", "ytsearch", "yts", "google", "weather", "define", "wiki", "wikipedia", "news", "telegram", "tg", "sweb", "setpfp", "run", "get", "check"]
    },
    fun: {
        title: "🎮 FUN MENU",
        list: ["joke", "dadjoke", "quote", "fact", "advice", "pickupline", "roast", "meme", "ship", "hack", "couple", "flirt", "compliment", "insult", "whoami", "stupidcheck", "uncleancheck", "hotcheck", "smartcheck", "greatcheck", "evilcheck", "dogcheck", "coolcheck", "gaycheck", "waifucheck"]
    },
    game: {
        title: "🎲 GAME MENU",
        list: ["tictactoe", "ttt", "wordchain", "wcg", "surrender", "endwcg", "truth", "dare", "8ball", "flip", "dice", "math", "trivia", "rps", "slot", "guess"]
    },
    stalk: {
        title: "🔍 STALK MENU",
        list: ["igstalk", "ttstalk", "ttstalk2", "ipstalk", "githubstalk", "tgchannelstalk", "tggroupstalk", "tgstalk", "wastalk", "zoomsearch"]
    },
    anime: {
        title: "🎭 ANIME MENU",
        list: ["waifu", "nwaifu", "rwaifu", "neko", "neko2", "animesearch", "animekill", "animelick", "animebite", "animewave", "animesmile", "animepoke", "animewink", "animebonk", "animebully", "animeyeet", "naruto", "sasuke", "sakura", "tsunade", "boruto", "madara", "itachi", "kakashi"]
    },
    sticker: {
        title: "🎨 STICKER MENU",
        list: ["s", "sticker", "take", "steal", "toimg", "qc", "emojimix", "smeme", "pat", "slap", "hug", "kiss", "bite", "blush", "bonk", "highfive", "handhold", "cuddle", "cry", "dance"]
    },
    voice: {
        title: "🎤 VOICE MENU",
        list: ["bass", "blown", "deep", "earrape", "fast", "fat", "nightcore", "reverse", "robot", "slow", "smooth", "squirrel"]
    },
    reaction: {
        title: "😊 REACTION MENU",
        list: ["laugh", "shy", "sad", "moon", "anger", "happy", "confused", "heart", "cool", "fire", "star", "thumbsup"]
    },
    textmaker: {
        title: "✍️ TEXT MAKER MENU",
        list: ["textimg", "txt2img", "aitext", "logo", "logo2", "gaming", "gfx1", "gfx2", "neon", "glitch", "3dtext", "chrome", "metal", "rainbow", "gradient", "firetext", "lightning", "watertext", "icetext", "galaxy", "animetext", "graffiti", "retro", "horror"]
    },
    image: {
        title: "🖼️ IMAGE MENU",
        list: ["blackpink", "jennie", "jisoo", "rose", "bts", "exo", "japanese", "korean", "hijab", "cyberpunk", "hacker", "space", "islamic", "quran", "freefire", "pubg", "mlnime"]
    },
    misc: {
        title: "📱 MISC MENU",
        list: ["repo", "script", "test", "save", "download", "afk", "reminder", "setmood", "mymood", "vv", "vv2", "checkidch", "reactch", "fakereact", "autoreact", "enc"]
    }
};

function buildCategoryText(prefix, key) {
    const cat = CATEGORIES[key];
    if (!cat) return null;
    const lines = cat.list.map((cmd) => `↩ *${prefix}${cmd}*`).join('\n');
    return `╭━━〔 ${cat.title} 〕━━┈⊷\n${lines}\n╰━━━━━━━━━━━━━━━━━━━━━┈⊷`;
}

function mainMenuButtons() {
    return Object.entries(CATEGORIES).map(([id, cat]) => ({
        id: `menu_${id}`,
        text: cat.title
    }));
}

const mainCaption = `╭────────────────
│ 🤖 ʙᴏᴛ  : *${botName}*
│ 👑 ᴏᴡɴᴇʀ : *${ownerName}*
│ 📦 ᴠᴇʀsɪᴏɴ : *${version}*
│ 📡 ᴘʟᴀᴛғᴏʀᴍ : *${platform}*
╰────────────────`;

function buildFullMenuText(prefix) {
    const sections = Object.values(CATEGORIES)
        .map((cat) => {
            const lines = cat.list.map((cmd) => `┃✰ ${prefix}${cmd}`).join('\n');
            return `┏━❮ ${cat.title} ❯━┓\n${lines}\n┗━━━━━━━━━━━━━┛`;
        })
        .join('\n\n');

    return `${mainCaption}\n\n${sections}`;
}

module.exports = {
    pattern: "menu",
    desc: "Show all available commands",
    category: "utility",
    react: "📋",
    use: ".menu",
    filename: __filename,

    CATEGORIES,
    buildCategoryText,
    buildFullMenuText,
    mainMenuButtons,
    mainCaption,
    menuImage,
    NEWSLETTER_JID,
    NEWSLETTER_NAME,

    execute: async (conn, message, m, { from, reply, userPrefix }) => {
        try {
            const prefix = userPrefix || ".";
            const text = buildFullMenuText(prefix);

            await conn.sendMessage(
                from,
                { image: { url: menuImage }, caption: text },
                { quoted: message }
            );
        } catch (err) {
            console.error("Menu error:", err);
            reply("❌ Failed to load menu.");
        }
    }
};
