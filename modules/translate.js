const translate = require('google-translate-api');

const TO = 'to';
const FROM = 'from';

module.exports = (command, message) => {
  return new Promise((resolve, reject) => {
    const params = message.split(' ');

    const options = {};

    let lastIndex = 2;

    if (params[1] === TO) {
      options[TO] = params[2];
    }

    if (params[3] === FROM) {
      options[FROM] = params[4];
      lastIndex = 4;
    }

    const text = params.reduce((prev, current, index) => {
      if (index > lastIndex) {
        return `${prev} ${current}`;
      } else {
        return prev;
      }
    }, '');

    translate(text, options)
      .then(res => {
        resolve(res.text);
      });
  });
}