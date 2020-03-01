/** Run every 30 minutes */
import cron from 'node-cron';
import scraper from '../scrapper/CovidScraper';

cron.schedule('*/30 * * * *', () => {
  console.log('Fetching new data...');
  scraper.run();
});
