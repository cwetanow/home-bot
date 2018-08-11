let request = require('request');
const moment = require('moment');

const COMMAND_NAME = 'weather';

const DEFAULT_CITY = 'sofia';
const DEFAULT_TYPE = 'weather';
const DEFAULT_DAYS_FORECAST = 3;

const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

module.exports = (command, message) => {
  if (command.toLowerCase() === COMMAND_NAME) {
    return new Promise((resolve, reject) => {
      const params = message.split(' ');
      let type = params[2] || DEFAULT_TYPE;
      let city = params[1] || DEFAULT_CITY;
      let days = +params[3] || DEFAULT_DAYS_FORECAST;

      let url = `http://api.openweathermap.org/data/2.5/${type}?q=${city}&appid=${apiKey}&units=metric`

      request.get(url, (err, response, body) => {
        if (err) {
          reject(err);
        }

        body = JSON.parse(body);

        let result = '';
        if (type === DEFAULT_TYPE) {
          result = `The current temperature in ${body.name} degrees is ${body.main.temp} with ${body.weather[0].description}`;
        } else if (type === 'forecast') {
          const forecasts = body.list;
          result += `The forecast for ${body.city.name} is\n`;

          for (let index = 0; index < forecasts.length; index++) {
            if (index > days * 8) {
              break;
            }

            const forecast = forecasts[index];

            const date = moment(forecast.dt_txt)
              .add(3, 'hours')
              .format('HH:mm, dddd');

            result += `\n ${date}: ${forecast.main.temp} degrees with ${forecast.weather[0].description}`
          }
        }

        resolve(result);
      })
    });
  }
}