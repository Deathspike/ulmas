import * as cheerio from 'cheerio';

export class SeriesInfoXml {
  private constructor(
    private readonly root: cheerio.Cheerio<cheerio.Element>) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: true});
    const root = $('tvshow');
    return new SeriesInfoXml(root);
  }

  get title() {
    const value = this.root.find('> title')
      .first()
      .text();
    return value.length
      ? value
      : '';
  }

  get dateAdded() {
    const value = this.root.find('> dateadded')
      .first()
      .text();
    return value.length
      ? new Date(value).toISOString()
      : undefined;
  }

  get lastPlayed() {
    const value = this.root.find('> lastPlayed')
      .first()
      .text();
    return value.length
      ? new Date(value).toISOString()
      : undefined;
  }
  
  get plot() {
    const value = this.root.find('> plot')
      .first()
      .text();
    return value.length
      ? value
      : undefined;
  }
}
