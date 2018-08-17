const fs = require('fs');

require('dotenv').config();

const MODULES_DIR = './modules/';

const modules = {};

fs
  .readdirSync(MODULES_DIR)
  .forEach(item => {
    modules[item.replace('.js', '')] = require(MODULES_DIR + item);
  });

let messageSender = require('./message-sender');

const onMessageSent = (message) => {
  const command = message.split(' ')[0];

  if (modules[command]) {
    modules[command](command, message)
      .then(response => {
        messageSender(response);
      })
      .catch(err => {
        messageSender('BOOP BEEP ME DEAD');
      });
  } else {
    messageSender('I was not able to parse your command');
  }
}

const { RTMClient } = require('@slack/client');

const rtm = new RTMClient(process.env.SLACK_BOT_OAUTH_ACCESS_TOKEN);
rtm.start();
var channel = "#general";

console.log('RUNNING');
rtm.on('message', (event) => {
  const message = event;

  if ((message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }

  onMessageSent(message.text);
});