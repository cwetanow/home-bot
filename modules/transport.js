let request = require('request');

const COMMAND_NAME = 'transport';

let stops = [];
let routes = [];

let url = 'https://routes.sofiatraffic.bg/resources/stops-bg.json';

(new Promise((resolve, reject) => {
  request.get(url, (err, response, body) => {
    resolve(JSON.parse(body));
  });
}))
  .then(res => {
    stops = res;

    url = 'https://routes.sofiatraffic.bg/resources/routes.json';

    return new Promise((resolve, reject) => {
      request.get(url, (err, response, body) => {
        resolve(JSON.parse(body));
      });
    })
  })
  .then(res => {
    routes = res;
  })


module.exports = (command, message) => {
  if (command.toLowerCase() === COMMAND_NAME) {
    return new Promise((resolve, reject) => {
      const params = message.split(' ');

      const type = params[1];

      if (type === 'stop') {
        const stopName = params[2].toLowerCase();

        const matched = stops.filter(s => s.n.toLowerCase().indexOf(stopName) >= 0);
        let result = '';

        matched.forEach(s => {
          result += `${s.n} ${s.c}\n`;
        });

        resolve(result);
      }
    });
  };
}