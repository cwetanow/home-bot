const { RTMClient } = require('@slack/client');

const config = require('./config');

const utils = require('./utils')(config);

console.log(utils);

// const rtm = new RTMClient(token);
// rtm.start();

// rtm.on('message', (event) => {
//   const message = event;

//   // Skip messages that are from a bot or my own user ID
//   if ((message.subtype && message.subtype === 'bot_message') ||
//     (!message.subtype && message.user === rtm.activeUserId)) {
//     return;
//   }

//   // // Log the message
//   console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
// });