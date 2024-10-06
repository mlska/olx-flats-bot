export default class MessageFactory {
  constructor() {}

  createMessage(flat) {
    return `Link: ${flat.link} \nCena: ${flat.price} \nPowierzchnia: ${flat.square} \nMiejscowość: ${flat.location} \nData:${flat.date}`;
  }
}
