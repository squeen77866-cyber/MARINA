const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports.config = {
  name: "couple",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Ahad Mughal",
  description: "Couple pairing with frame and DPs",
  commandCategory: "roleplay",
  usages: "couple",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const senderID = event.senderID;
    const participants = event.participantIDs.filter(id => id !== senderID);
    const partnerID = participants[Math.floor(Math.random() * participants.length)];

    const senderName = (await Users.getData(senderID)).name;
    const partnerName = (await Users.getData(partnerID)).name;

    const lovePercent = Math.floor(Math.random() * 101);
    const heartEmoji = lovePercent > 75 ? "💖" : lovePercent > 50 ? "💘" : lovePercent > 30 ? "💕" : "💔";

    const avatarURL1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
    const avatarURL2 = `https://graph.facebook.com/${partnerID}/picture?width=512&height=512`;

    const [avatar1Buffer, avatar2Buffer] = await Promise.all([
      axios.get(avatarURL1, { responseType: "arraybuffer" }).then(res => res.data),
      axios.get(avatarURL2, { responseType: "arraybuffer" }).then(res => res.data)
    ]);

    const img1 = await Canvas.loadImage(avatar1Buffer);
    const img2 = await Canvas.loadImage(avatar2Buffer);
    const frame = await Canvas.loadImage(path.join(__dirname, "frame.png"));

    const width = 700, height = 500;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ffe6f0");
    gradient.addColorStop(1, "#ccf2ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw circular avatars
    function drawCircularImage(ctx, img, x, y, size) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    }

    drawCircularImage(ctx, img1, 100, 100, 200);
    drawCircularImage(ctx, img2, 400, 100, 200);

    // Frame on top
    ctx.drawImage(frame, 0, 0, width, height);

    // Names
    ctx.font = "28px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(senderName, 130, 330);
    ctx.fillText(partnerName, 430, 330);

    // Ensure cache folder exists
    const cachePath = path.join(__dirname, "cache");
    fs.ensureDirSync(cachePath);
    const imagePath = path.join(cachePath, `couple_${senderID}.png`);

    // Save image
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on("finish", () => {
      api.sendMessage({
        body: 
`💑 𝗖𝗢𝗨𝗣𝗟𝗘 𝗣𝗔𝗜𝗥𝗘𝗗 ${heartEmoji}
${senderName} 💓 ${partnerName}
Love Percent: ${lovePercent}%

👑 Created by: 『𝐀𝐡𝐚𝐝 𝐌𝐮𝐠𝐡𝐚𝐥』💎`,
        mentions: [
          { id: senderID, tag: senderName },
          { id: partnerID, tag: partnerName }
        ],
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath));
    });

  } catch (err) {
    console.error("Error in couple module:", err);
    api.sendMessage("❌ Error: RANDAVA MARO TUM 😂🥱. Please check logs or image assets.", event.threadID);
  }
};
