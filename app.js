import 'dotenv/config';
import cron from 'node-cron';
import OlxBot from './src/OlxBot.js';

console.log(`Olx bot started`);
const olxBot = new OlxBot({
  flatsStorageFilePath: './data/flats_ids.json',
  locationsStorageFilePath: './data/locations_urls.json',
  telegramToken: process.env.TELEGRAM_TOKEN,
  messageReceiver: process.env.USER_ID
});

cron.schedule('0 7,12,17,22 * * *', async () => {
  console.log(`Scraping started`);

  const start = performance.now();

  await olxBot.scrap();

  const end = performance.now();
  const executionTime = ((end - start) / 1000).toFixed(2);

  console.log(`Scraping finished. Execution time: ${executionTime} s`);
});
