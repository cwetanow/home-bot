const express = require('express');
const { RTMClient } = require('@slack/client');
const fs = require('fs');

const app = express();

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
  let command = message.split(' ')[0];
  if (command) {
    command = command.toLowerCase();
  }

  if (modules[command]) {
    modules[command](command, message)
      .then(response => {
        messageSender(response);
      })
      .catch(err => {
        console.log(err);
        messageSender('BOOP BEEP ME CRASH');
      });
  } else {
    messageSender('I was not able to parse your command');
  }
}

const rtm = new RTMClient(process.env.SLACK_BOT_OAUTH_ACCESS_TOKEN);
rtm.start();

messageSender('RUNNING');

rtm.on('message', (event) => {
  const message = event;

  if ((message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }

  console.log(message.text);

  onMessageSent(message.text);
});

app.get('*', (req, res) => {
  res.send('BEEP BOOP ME ALIVE');
});

app.listen(process.env.PORT, () => {
  console.log('RUNNING');
});