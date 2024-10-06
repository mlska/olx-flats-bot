import 'dotenv/config';

import TelegramBot from './src/classes/TelegramBot.mjs';
import Olx from './src/classes/Olx.mjs';
import FlatsStorage from './src/classes/FlatsStorage.mjs';
import MessageFactory from './src/classes/MessageFactory.mjs';
import LocationsStorage from './src/classes/LocationsStorage.mjs';

///
console.log(`App started`);
const start = performance.now();

const flatsStorage = new FlatsStorage('./data/flats_ids.json');
const locationsStorage = new LocationsStorage('./data/locations_urls.json');
const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const messageFactory = new MessageFactory();
const olx = new Olx();

const urls = locationsStorage.getUrls();

await olx.open();

const flats = [];
for (const i in urls) {
  const data = await olx.getFlats(urls[i]);
  flats.push(...data);
}

await olx.close();

const newFlats = flats.filter((flat) => !flatsStorage.checkId(flat.id));

console.log(`${newFlats.length} nowych mieszkań`);

if (newFlats.length === 0) {
  telegramBot.sendMessage(process.env.USER_ID, `Brak nowych mieszkań`);
}

newFlats.forEach((flat) => {
  flatsStorage.addId(flat.id);
  const message = messageFactory.createMessage(flat);
  telegramBot.sendMessage(process.env.USER_ID, message);
});

flatsStorage.saveStorage();

const end = performance.now();
console.log(`App finished. Execution time: ${end - start} ms`);
