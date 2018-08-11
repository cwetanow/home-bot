const messageSenderInit = require('./message-sender');

module.exports = (config) => {
  const messageSender = messageSenderInit(config.slack.token);

  return {
    messageSender
  };
}