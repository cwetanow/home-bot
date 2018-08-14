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
    stops = res
      .map(stop => { return { name: stop.n, code: stop.c } });

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

        const matched = stops.filter(s => s.name.toLowerCase().indexOf(stopName) >= 0);
        let result = '';

        matched.forEach(stop => {
          result += `${stop.name} ${stop.code}\n`;
        });

        return resolve(result);
      }

      if (type === 'code') {
        const code = params[2];

        url = `https://api-arrivals.sofiatraffic.bg/api/v1/arrivals/${code}/`;

        request.get(url, (err, response, body) => {
          body = JSON.parse(body);

          let result = `${body.name}\n`;

          body.lines.forEach(line => {
            result += `${line.vehicle_type} ${line.name} `;

            line.arrivals.forEach(arrival => {
              result += ` ${arrival.time}`;
            })

            result += '\n';
          });

          resolve(result);
        });
      }
    });
  };
}