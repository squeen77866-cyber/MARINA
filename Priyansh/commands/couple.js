const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");

module.exports.config = {
  name: "couple",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ahad Mughal",
  description: "Random VIP love pairing",
  commandCategory: "roleplay",
  usages: "couple",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, Users }) {
  const senderID = event.senderID;
  const threadID = event.threadID;
  const messageID = event.messageID;

  // Random love percentage
  const tile = Math.floor(Math.random() * 101);

  // Random user from group
  const participants = event.participantIDs;
  const id = participants[Math.floor(Math.random() * participants.length)];

  if (id === senderID) return api.sendMessage("💔 Cannot pair with yourself!", threadID, messageID);

  const name1 = (await Users.getData(senderID)).name;
  const name2 = (await Users.getData(id)).name;

  const avatar1 = await axios.get(`https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" });
  const avatar2 = await axios.get(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" });

  fs.writeFileSync(__dirname + "/cache/avt1.png", Buffer.from(avatar1.data, "utf-8"));
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(avatar2.data, "utf-8"));

  const img1 = await Canvas.loadImage(__dirname + "/cache/avt1.png");
  const img2 = await Canvas.loadImage(__dirname + "/cache/avt2.png");

  // Optional: Use a VIP heart frame PNG
  const framePath = __dirname + "/cache/vipframe.png";
  const frame = await Canvas.loadImage(framePath);

  const canvas = Canvas.createCanvas(800, 400);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffccdd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw avatars in circles
  ctx.save();
  ctx.beginPath();
  ctx.arc(200, 200, 150, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img1, 50, 50, 300, 300);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(600, 200, 150, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img2, 450, 50, 300, 300);
  ctx.restore();

  // Draw frame over the avatars
  ctx.drawImage(frame, 0, 0, 800, 400);

  const buffer = canvas.toBuffer();
  fs.writeFileSync(__dirname + "/cache/vipcouple.png", buffer);

  const msg = {
    body: `💞 [ 𝗟𝗢𝗩𝗘 𝗣𝗔𝗜𝗥 𝗔𝗟𝗘𝗥𝗧 ] 💞\n\n💘 𝗥𝗼𝗠𝗮𝗡𝗖𝗲 𝗥𝗮𝗧𝗶𝗢: ${tile}%\n${name1} 💓 ${name2}\n\n👑 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗕𝘆: 𝘼𝙝𝙖𝙙 𝙈𝙪𝙜𝙝𝙖𝙡 𝙑𝙄𝙋 💎`,
    mentions: [
      { id: senderID, tag: name1 },
      { id: id, tag: name2 }
    ],
    attachment: fs.createReadStream(__dirname + "/cache/vipcouple.png")
  };

  return api.sendMessage(msg, threadID, () => {
    fs.unlinkSync(__dirname + "/cache/avt1.png");
    fs.unlinkSync(__dirname + "/cache/avt2.png");
    fs.unlinkSync(__dirname + "/cache/vipcouple.png");
  }, messageID);
};
