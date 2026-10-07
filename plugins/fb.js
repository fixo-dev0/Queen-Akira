const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "fb",
  react: "☺️",
  alias: ["facebook", "fbdl"],
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("*YOU WANT TO DOWNLOAD A FACEBOOK VIDEO 🤔 THEN COPY THE LINK OF THAT FACEBOOK VIDEO 🤗*\n*THEN TYPE LIKE THIS ☺️*\n\n*FB ❮FACEBOOK VIDEO LINK❯*\n\n*WHEN YOU TYPE LIKE THIS 😇 YOUR FACEBOOK VIDEO WILL BE DOWNLOADED AND SENT HERE 😃😍♥️*");

    const apiUrl = `https://movanest.xyz/v2/fbdown?url=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    // 🔎 API status check
    if (data.status !== true) {
      return reply("API ERROR 😢");
    }

    // 🔎 Results check
    if (!Array.isArray(data.results) || data.results.length === 0) {
      return reply("*FACEBOOK VIDEO NOT FOUND 🥺*");
    }

    const result = data.results[0];

    // 🎥 Quality selection (API ke mutabiq)
    const videoUrl = result.hdQualityLink
      ? result.hdQualityLink
      : result.normalQualityLink;

    if (!videoUrl) {
      return reply("*JUST GIVE THE FACEBOOK VIDEO LINK ☺️*");
    }

    // 📝 Caption API data se
    const caption = `*👑 FB VIDEO 👑*
*👑 TIME :❯ ${result.duration}*
*👑 CREATER :❯ ${data.creator}*
*👑 BY :❯ 𝙌𝙪𝙚𝙚𝙣 𝘼𝙠𝙞𝙧𝙖 🕊️*`;

    await conn.sendMessage(
      from,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: caption
      },
      { quoted: mek }
    );

  } catch (err) {
    console.log(err);
    reply("❌ An error occurred");
  }
});