import 'dotenv/config';

import TelegramBot from './classes/TelegramBot.js';
import Olx from './classes/Olx.js';
import FlatsStorage from './classes/FlatsStorage.js';
import MessageFactory from './classes/MessageFactory.js';
import LocationsStorage from './classes/LocationsStorage.js';

import getUniqueListBy from './utils/getUniqueListBy.js';

export default class OlxBot {
  constructor(config) {
    this.flatsStorageFilePath = config.flatsStorageFilePath;
    this.locationsStorageFilePath = config.locationsStorageFilePath;
    this.telegramToken = config.telegramToken;
    this.messageReceiver = config.messageReceiver;
  }

  async scrap() {
    const flatsStorage = new FlatsStorage(this.flatsStorageFilePath);
    const locationsStorage = new LocationsStorage(this.locationsStorageFilePath);
    const telegramBot = new TelegramBot(this.telegramToken);
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

    const newFlats = getUniqueListBy(flats.filter((flat) => !flatsStorage.checkId(flat.id)));

    console.log(`${newFlats.length} nowych mieszkań`);

    if (newFlats.length === 0) {
      telegramBot.sendMessage(this.messageReceiver, `Brak nowych mieszkań`);
    }

    newFlats.forEach((flat) => {
      flatsStorage.addId(flat.id);
      const message = messageFactory.createMessage(flat);
      telegramBot.sendMessage(this.messageReceiver, message);
    });

    flatsStorage.saveStorage();
  }
}
