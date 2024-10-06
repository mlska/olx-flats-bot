import * as fs from 'fs';

export default class FlatsStorage {
  constructor(filePath) {
    this.filePath = filePath;
    this.ids = JSON.parse(fs.readFileSync(this.filePath));
  }

  getIds() {
    return JSON.parse(fs.readFileSync(this.filePath));
  }

  checkId(id) {
    return this.ids.some((storedId) => storedId === id);
  }

  addId(id) {
    this.ids.push(id);
  }

  saveStorage() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.ids));
  }
}
