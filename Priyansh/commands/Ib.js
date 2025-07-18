const fs = require("fs");
module.exports.config = {
  name: "inbox",
    version: "1.1.1",
  hasPermssion: 0,
  credits: "SHANKAR SUMAN", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("ib a") ||
     react.includes("Ib s") || react.includes("IB") || react.includes("INBOX") ||
react.includes("inbox") ||
react.includes("Inbox")) {
    var msg = {
        body: `tori sharam kro yaha single log b ha 😒😐👈`,
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("👀", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
