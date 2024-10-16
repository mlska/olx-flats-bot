import { Bot } from 'grammy';

export default class Telegram {
  constructor(token) {
    this.token = token;
    this.bot = new Bot(this.token);
  }

  sendMessage(to, message) {
    this.bot.api.sendMessage(to, message);
  }

  startCommandListener(command, callback) {
    this.bot.hears(command, (ctx) => {
      callback(ctx);
    });
  }

  start() {
    this.bot.start();
  }
}
