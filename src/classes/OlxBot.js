import 'dotenv/config';

import Telegram from './Telegram.js';
import Olx from './Olx.js';
import FlatsStorage from './FlatsStorage.js';
import MessageFactory from './MessageFactory.js';
import LocationsStorage from './LocationsStorage.js';

import getUniqueListBy from '../utils/getUniqueListBy.js';

export default class OlxBot {
  constructor(config) {
    this.flatsStorageFilePath = config.flatsStorageFilePath;
    this.locationsStorageFilePath = config.locationsStorageFilePath;
    this.telegramToken = config.telegramToken;
    this.messageReceiver = config.messageReceiver;

    this.flatsStorage = new FlatsStorage(this.flatsStorageFilePath);
    this.locationsStorage = new LocationsStorage(this.locationsStorageFilePath);
    this.telegram = new Telegram(this.telegramToken);
    this.messageFactory = new MessageFactory();
  }

  async scrap() {
    console.log(`Scraping started`);
    const start = performance.now();

    const olx = new Olx();

    const urls = this.locationsStorage.getUrls();

    await olx.open();

    const flats = [];
    for (const i in urls) {
      const data = await olx.getFlats(urls[i]);
      flats.push(...data);
    }

    await olx.close();

    const newFlats = getUniqueListBy(flats, 'id').filter(
      (flat) => !this.flatsStorage.checkId(flat.id)
    );

    console.log(`${newFlats.length} nowych mieszkań`);

    if (newFlats.length === 0) {
      this.telegram.sendMessage(this.messageReceiver, `Brak nowych mieszkań`);
    }

    newFlats.forEach((flat) => {
      this.flatsStorage.addId(flat.id);
      const message = this.messageFactory.createMessage(flat);
      this.telegram.sendMessage(this.messageReceiver, message);
    });

    this.flatsStorage.saveStorage();

    const end = performance.now();
    const executionTime = ((end - start) / 1000).toFixed(2);
    console.log(`Scraping time: ${executionTime} s`);
  }
}
