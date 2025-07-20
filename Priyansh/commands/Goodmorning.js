module.exports.config = {
  name: "gm2",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "John Lester", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
  var { threadID, messageID } = event;
  var name = await Users.getNameUser(event.senderID);
  if (event.body.indexOf("good morning")>=0 || event.body.indexOf("Good Morning")>=0 || event.body.indexOf("gm")>=0 || event.body.indexOf("Gm")>=0 || event.body.indexOf("GM")>=0 || event.body.indexOf("GOOD MORNING")>=0 || event.body.indexOf("Good morning")>=0 || event.body.indexOf("Magandang gabi")>=0 || event.body.indexOf("magandang Gabi")>=0 || event.body.indexOf("Magandang Gabi")>=0 ) { 
    var msg = {
        body: `{
  "text": "🌼 بسم اللہ الرحمٰن الرحیم 🌼\n\n`اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎ 🤝`\n\nصَلَّی ﷲُ عَلَیْہِ وَآلِہٖ وَسَلَّمْ ♥️\nصَلَّی ﷲُ عَلَیْہِ وَآلِہٖ وَسَلَّمْ ♥️\n\n📿 درود پاک کا ورد کثرت سے کریں۔\n🤲 رب اور اس کا حبیب، جناب محمد مصطفی ﷺ آپ سے راضی ہوں۔\n\n🌹 کثرت سے درود پڑھتے رہیں 🌹"
} ${name} ❤️`
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🌞", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
