export default class UrlFactory {
  constructor() {
    this.baseUrl = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/`;
  }

  createUrls(location) {
    let urls = [];
    if (!location.districts.length) {
      urls.push(this.baseUrl + location.name);
    }

    location.districts.forEach((district) => {
      urls.push(this.baseUrl + location.name + '/q-' + district);
    });
    return urls;
  }
}
