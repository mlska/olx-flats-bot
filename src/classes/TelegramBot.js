import { Bot } from 'grammy';

export default class TelegramBot {
  constructor(token) {
    this.token = token;
    this.bot = new Bot(this.token);
  }

  sendMessage(to, message) {
    this.bot.api.sendMessage(to, message);
  }
}
