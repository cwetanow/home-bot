require('dotenv').config();

const config = {
  slack: {
    token: process.env.SLACK_OAUTH_ACCESS_TOKEN,
    rtmToken: process.env.SLACK_BOT_OAUTH_ACCESS_TOKEN
  }
}

module.exports = config;