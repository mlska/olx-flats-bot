import 'dotenv/config';
import cron from 'node-cron';
import OlxBot from './classes/OlxBot.js';

const { USER_ID: messageReceiver, TELEGRAM_TOKEN: telegramToken } = process.env;

const olxBot = new OlxBot({
  flatsStorageFilePath: './data/flats_ids.json',
  locationsStorageFilePath: './data/locations_urls.json',
  telegramToken,
  messageReceiver
});

cron.schedule('0 7,12,17,22 * * *', () => {
  olxBot.scrap();
});

olxBot.telegram.startCommandListener('@scrap', async () => {
  olxBot.telegram.sendMessage(messageReceiver, `Manual scraping`);
  const newFlats = await olxBot.scrap();
  !newFlats && olxBot.telegram.sendMessage(messageReceiver, `Brak nowych mieszkań`);
});

olxBot.telegram.startCommandListener('@status', () => {
  olxBot.telegram.sendMessage(messageReceiver, `Online`);
});

olxBot.telegram.start();
