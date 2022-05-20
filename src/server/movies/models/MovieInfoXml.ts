import * as cheerio from 'cheerio';

export class MovieInfoXml {
  private constructor(
    private readonly root: cheerio.Cheerio<cheerio.Element>) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: true});
    const root = $('movie');
    return new MovieInfoXml(root);
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

  get playCount() {
    const value = Number(this.root.find('> playcount')
      .first()
      .text());
    return value
      ? value
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

  get resume() {
    const position = Number(this.root.find('> resume > position')
      .first()
      .text());
    const total = Number(this.root.find('> resume > total')
      .first()
      .text());
    return position && total
      ? {position, total}
      : undefined;
  }

  get watched() {
    const value = this.root.find('> watched')
      .first()
      .text();
    return value.length && /^true$/i.test(value)
      ? true
      : undefined;
  }
}
