module.exports.config = {
  name: "couple",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "Ahad Mughal",
  description: "Instant couple pairing with names and emojis",
  commandCategory: "roleplay",
  usages: "couple",
  cooldowns: 3,
  dependencies: {}
};

module.exports.run = async function({ api, event, Users }) {
  const members = event.participantIDs.filter(id => id !== event.senderID);
  const partnerID = members[Math.floor(Math.random() * members.length)];

  const senderName = (await Users.getData(event.senderID)).name;
  const partnerName = (await Users.getData(partnerID)).name;

  const lovePercent = Math.floor(Math.random() * 101);
  const heartEmoji = lovePercent > 75 ? "💖" : lovePercent > 50 ? "💘" : lovePercent > 30 ? "💕" : "💔";

  const mentionArray = [
    { id: event.senderID, tag: senderName },
    { id: partnerID, tag: partnerName }
  ];

  const message = 
`━━━━━━━━━━━━━━━━━━━
💑 𝑪𝑶𝑼𝑷𝑳𝑬 𝑷𝑨𝑰𝑹𝑬𝑫 💞

🥰 𝗖𝗼𝘂𝗽𝗹𝗲:
➤ ${senderName} ${heartEmoji} ${partnerName}

💘 𝗟𝗼𝘃𝗲 𝗣𝗲𝗿𝗰𝗲𝗻𝘁:
➤ ${lovePercent}%

🛠️ 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚: 『𝐀𝐡𝐚𝐝 𝐌𝐮𝐠𝐡𝐚𝐥』💎
━━━━━━━━━━━━━━━━━━━`;

  return api.sendMessage({ body: message, mentions: mentionArray }, event.threadID, event.messageID);
};
