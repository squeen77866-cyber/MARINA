const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports.config = {
  name: "couple",
  version: "3.0.0",
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
    const frame = await Canvas.loadImage(path.join(__dirname, "frame.png")); // You must place your frame.png in same folder

    const canvas = Canvas.createCanvas(700, 500);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw DPs side by side
    ctx.drawImage(img1, 50, 100, 250, 250);
    ctx.drawImage(img2, 400, 100, 250, 250);

    // Frame over
    ctx.drawImage(frame, 0, 0, 700, 500);

    // Write names
    ctx.font = "28px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(senderName, 110, 380);
    ctx.fillText(partnerName, 460, 380);

    // Save final image
    const imagePath = path.join(__dirname, "cache", `couple_${senderID}.png`);
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
    console.error(err);
    api.sendMessage("❌ Error: Could not generate couple image.", event.threadID);
  }
};
