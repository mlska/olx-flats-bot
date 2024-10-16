import 'dotenv/config';

import OlxBot from './classes/OlxBot.js';
import Cron from './classes/Cron.js';

const { USER_ID: messageReceiver, TELEGRAM_TOKEN: telegramToken } = process.env;

const defaultSchedule = '0 7,12,17,22 * * *';

const olxBot = new OlxBot({
  flatsStorageFilePath: './data/flats_ids.json',
  locationsStorageFilePath: './data/locations_urls.json',
  telegramToken,
  messageReceiver
});

const cron = new Cron();

cron.startJob(defaultSchedule, () => {
  olxBot.scrap();
});

olxBot.telegram.startCommandListener('@scrap', () => {
  olxBot.telegram.sendMessage(messageReceiver, `Manual scraping`);
  olxBot.scrap();
});

olxBot.telegram.startCommandListener('@status', () => {
  olxBot.telegram.sendMessage(messageReceiver, `Online`);
});

olxBot.telegram.startCommandListener(/\@schedule (.+)/, (ctx) => {
  const schedule = ctx.match[1];
  const isValid = cron.validate(schedule);
  const message = isValid ? `New scraping schedule ${schedule}` : `Incorret schedule`;
  isValid &&
    cron.startJob(schedule, () => {
      olxBot.scrap();
    });
  olxBot.telegram.sendMessage(messageReceiver, message);
});

olxBot.telegram.startCommandListener('@default', () => {
  cron.startJob(defaultSchedule, () => {
    olxBot.scrap();
  });
  olxBot.telegram.sendMessage(messageReceiver, `Default schedule set`);
});

olxBot.telegram.start();
