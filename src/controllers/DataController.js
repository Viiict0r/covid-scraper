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

    const confirmed = JSON.parse(promises[0]);
    const deaths = JSON.parse(promises[1]);
    const recovered = JSON.parse(promises[2]);

    return res.json({
      confirmed,
      deaths,
      recovered,
    });
  }
}
export default new DataController();
