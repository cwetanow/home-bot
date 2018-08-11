const { IncomingWebhook } = require('@slack/client');
const token = process.env.SLACK_WEBHOOK_URL;

const sendMessage = (message) => {
  const hook = new IncomingWebhook(token);

  hook.send(message, (error, resp) => {
    if (error) {
      return console.error(error);
    }
  });
}

module.exports = sendMessage;