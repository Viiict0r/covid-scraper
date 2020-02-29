/* eslint-disable radix */

import fs from 'fs';
import { promisify } from 'util';

class DataController {
  /** Serve statistics */

  async index(_, res) {
    const readData = promisify(fs.readFile);

    const promises = await Promise.all([
      readData('data_confirmed.json', 'utf8'),
      readData('data_deaths.json', 'utf8'),
      readData('data_recovered.json', 'utf8'),
    ]);

    // Get all countries
    const countries = [];
    const data = [];

    const confirmed = JSON.parse(promises[0]);
    const deaths = JSON.parse(promises[1]);
    const recovered = JSON.parse(promises[2]);

    confirmed.forEach(obj => {
      const country = obj['Country/Region'];

      if (!countries.includes(country)) {
        countries.push(country);
      }
    });

    deaths.forEach(obj => {
      const country = obj['Country/Region'];

      if (!countries.includes(country)) {
        countries.push(country);
      }
    });

    recovered.forEach(obj => {
      const country = obj['Country/Region'];

      if (!countries.includes(country)) {
        countries.push(country);
      }
    });

    countries.forEach(obj => {
      const confirmed_values = confirmed.filter(
        value => value['Country/Region'] === obj
      );
      const death_values = deaths.filter(
        value => value['Country/Region'] === obj
      );
      const recovered_values = recovered.filter(
        value => value['Country/Region'] === obj
      );

      let confirmed_amount = 0;
      let death_amount = 0;
      let recovered_amount = 0;

      // Sum values
      confirmed_values.forEach(c => {
        const array = Object.values(c);
        const last = array[array.length - 1];

        confirmed_amount += parseInt(last);
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

      data.push({
        country: obj,
        confirmed_amount,
        death_amount,
        recovered_amount,
      });
    });

    return res.json(data);
  }
}
export default new DataController();
