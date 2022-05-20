import * as cheerio from 'cheerio';

export class MovieInfoXml {
  private constructor(
    private readonly value: cheerio.Cheerio<cheerio.Element>) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: true});
    const value = $('movie');
    return new MovieInfoXml(value);
  }

  get plot() {
    return this.value.find('plot').text() || undefined;
  }
  
  get title() {
    return this.value.find('title').text();
  }
}
