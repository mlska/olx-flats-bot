import * as fs from 'fs';

export default class LocationsStorage {
  constructor(filePath) {
    this.urlsFilePath = filePath;
  }

  getUrls() {
    return JSON.parse(fs.readFileSync(this.urlsFilePath));
  }
}
