const { IncomingWebhook, RTMClient } = require('@slack/client');

const rtm = new RTMClient(token);
rtm.start();

const timeNotification = new IncomingWebhook(hook);

const currentTime = new Date().toTimeString();
timeNotification.send(`The current time is ${currentTime}`, (error, resp) => {
  if (error) {
    return console.error(error);
  }
  console.log('Notification sent');
});

rtm.on('message', (event) => {
  const message = event;

  // Skip messages that are from a bot or my own user ID
  if ((message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }

  // // Log the message
  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
});