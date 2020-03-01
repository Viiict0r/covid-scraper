/* eslint-disable radix */

import fs from 'fs';
import { promisify } from 'util';

class CoordController {
  async index(_, res) {
    const readData = promisify(fs.readFile);

    const promises = await Promise.all([
      readData('data_confirmed.json', 'utf8'),
      readData('data_deaths.json', 'utf8'),
      readData('data_recovered.json', 'utf8'),
    ]);

    const confirmed = JSON.parse(promises[0]);
    const deaths = JSON.parse(promises[1]);
    const recovered = JSON.parse(promises[2]);

    const cities = [];
    const data = [];

    confirmed.forEach(obj => {
      const country = obj['Country/Region'];
      const city = obj['Province/State'];

      const str = `${city}#${country}`;

      if (!cities.includes(str)) {
        cities.push(str);
      }
    });

    deaths.forEach(obj => {
      const country = obj['Country/Region'];
      const city = obj['Province/State'];

      const str = `${city}#${country}`;

      if (!cities.includes(str)) {
        cities.push(str);
      }
    });

    recovered.forEach(obj => {
      const country = obj['Country/Region'];
      const city = obj['Province/State'];

      const str = `${city}#${country}`;

      if (!cities.includes(str)) {
        cities.push(str);
      }
    });

    cities.forEach(obj => {
      const country = obj.split('#')[1];
      const city = obj.split('#')[0];

      const confirmed_values = confirmed.filter(
        value =>
          value['Country/Region'] === country &&
          value['Province/State'] === city
      );
      const death_values = deaths.filter(
        value =>
          value['Country/Region'] === country &&
          value['Province/State'] === city
      );
      const recovered_values = recovered.filter(
        value =>
          value['Country/Region'] === country &&
          value['Province/State'] === city
      );

      let confirmed_amount = 0;
      let death_amount = 0;
      let recovered_amount = 0;
      let latitude = 0;
      let longitude = 0;

      // Sum values
      confirmed_values.forEach(c => {
        const array = Object.values(c);
        const last = array[array.length - 1];

        confirmed_amount += parseInt(last);
        latitude = c.Lat;
        longitude = c.Long;
      });

      death_values.forEach(c => {
        const array = Object.values(c);
        const last = array[array.length - 1];

        death_amount += parseInt(last);
      });

      recovered_values.forEach(c => {
        const array = Object.values(c);
        const last = array[array.length - 1];

        recovered_amount += parseInt(last);
      });

      if (confirmed_amount > 0 || death_amount > 0 || recovered_amount > 0) {
        data.push({
          country: obj,
          city,
          confirmed_amount,
          death_amount,
          recovered_amount,
          latitude,
          longitude,
        });
      }
    });

    return res.json(data);
  }
}

export default new CoordController();
