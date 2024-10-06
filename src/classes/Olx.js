import puppeteer from 'puppeteer';

export default class Olx {
  constructor() {
    this.baseUrl = 'https://www.olx.pl';
  }

  async open() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
  }

  async close() {
    await this.browser.close();
  }

  async getFlats(url) {
    await this.page.goto(url);
    const list = await this.page.$('[data-testid="listing-grid"]');
    const flats = await list.$$eval('[data-cy="l-card"]', (items) => {
      return items.map((i) => {
        const id = i.getAttribute('id');
        const title = i.querySelector('h6').innerText;
        let link = i.querySelector('a').getAttribute('href');
        if (!link.includes('https')) {
          link = 'https://www.olx.pl' + link;
        }
        const price = parseFloat(
          i.querySelector('[data-testid="ad-price"]').innerHTML.split(' zł')[0].replace(' ', '')
        );
        const square = i.querySelector('[data-testid="blueprint-card-param-icon"]').nextSibling
          .textContent;
        const [location, date] = i
          .querySelector('[data-testid="location-date"]')
          .textContent.split(' - ');
        return { id, link, title, price, square, location, date };
      });
    });

    return flats;
  }
}