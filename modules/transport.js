let request = require('request');

const COMMAND_NAME = 'transport';

let stops = null;
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
  });

const transportTypes = {
  bus: 'bus',
  trolley: 'trolley',
  tram: 'tram'
}

const getLine = (type, name) => {
  const transportTypeLines = routes.find(r => r.type === type);

  if (transportTypeLines) {
    const line = transportTypeLines.lines.find(l => l.name.toLowerCase().indexOf(name.toLowerCase()) >= 0);

    if (line) {
      line.routes.forEach(route => {
        route.stops = [];

        route.codes.forEach(c => {
          const stop = stops.find(s => s.code === c);
          route.stops.push(stop)
        })
      });

      return line;
    }
  }
}

const getRouteFirstLastStop = (route) => {
  const firstStop = route.stops[0];
  const lastStop = route.stops[route.stops.length - 1];

  return `${firstStop.name} (${firstStop.code}) - ${lastStop.name} (${lastStop.code})`;
}

module.exports = (command, message) => {
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

          let lineInfo = getLine(line.vehicle_type, line.name);
          const route = lineInfo.routes.find(r => !!r.codes.find(c => c === code));

          result += getRouteFirstLastStop(route);

          line.arrivals.forEach(arrival => {
            result += ` ${arrival.time}`;
          })

          result += '\n';
        });

        return resolve(result);
      });
    }

    if (transportTypes.hasOwnProperty(type)) {
      const name = params[2];

      const line = getLine(type, name);

      if (!line) {
        return resolve('Line not found');
      }

      let result = `${type} ${line.name}:\n`;

      const isFull = params[3] && params[3] === 'full';

      line.routes.forEach(route => {
        if (isFull) {
          route.stops.forEach(stop => {
            result += `${stop.name} (${stop.code}) - `;
          })

          result += '\n';
        } else {
          result += getRouteFirstLastStop(route);
        }

        result += '\n';
      })

      return resolve(result);
    }
  });
}