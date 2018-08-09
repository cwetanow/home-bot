const { IncomingWebhook } = require('@slack/client');
const hookToken = process.env.hookToken;

module.exports = (message) => {
  const hook = new IncomingWebhook(hookToken);

  timeNotification.send(message, (error, resp) => {
    if (error) {
      return console.error(error);
    }
  });
}