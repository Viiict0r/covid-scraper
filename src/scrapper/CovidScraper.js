import request from 'request';
import csv from 'csvtojson';
import fs from 'fs';

class CovidScraper {
  constructor() {
    const base_url =
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series';

    this.url_confirmed = `${base_url}/time_series_19-covid-Confirmed.csv`;
    this.url_deaths = `${base_url}/time_series_19-covid-Deaths.csv`;
    this.url_recovered = `${base_url}/time_series_19-covid-Recovered.csv`;
  }

  fetchRecovered() {
    const data = request.get(this.url_recovered);

    this.parse(data).then(rows => {
      /** Write json file */
      fs.writeFile('data_recovered.json', JSON.stringify(rows), 'utf8', () => {
        console.log('Recovered data fetched!');
      });
    });
  }

  fetchDeaths() {
    const data = request.get(this.url_deaths);

    this.parse(data).then(rows => {
      /** Write json file */
      fs.writeFile('data_deaths.json', JSON.stringify(rows), 'utf8', () => {
        console.log('Deaths data fetched!');
      });
    });
  }

  fetchConfirmed() {
    const data = request.get(this.url_confirmed);

    this.parse(data).then(rows => {
      /** Write json file */
      fs.writeFile('data_confirmed.json', JSON.stringify(rows), 'utf8', () => {
        console.log('Confirmed data fetched!');
      });
    });
  }

  async run() {
    /** Fetch new data */
    await Promise.all([
      this.fetchConfirmed(),
      this.fetchDeaths(),
      this.fetchRecovered(),
    ]);
  }

  parse(data) {
    return new Promise((resolve, reject) => {
      const rows = [];
      csv()
        .fromStream(data)
        .subscribe(
          json => {
            rows.push(json);
          },
          () => {
            reject();
          },
          () => {
            resolve(rows);
          }
        );
    });
  }
}

export default new CovidScraper();
