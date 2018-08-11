const { IncomingWebhook } = require('@slack/client');
const hookToken = process.env.hookToken;

module.exports = (token) => {
  const sendMessage = (message) => {
    const hook = new IncomingWebhook(token);

    timeNotification.send(message, (error, resp) => {
      if (error) {
        return console.error(error);
      }
    });
  }

  return sendMessage;
}