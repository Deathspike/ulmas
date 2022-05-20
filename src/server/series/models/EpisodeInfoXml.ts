import * as cheerio from 'cheerio';

export class EpisodeInfoXml {
  private constructor(
    private readonly value: cheerio.Cheerio<cheerio.Element>) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: true});
    const value = $('episodedetails');
    return new EpisodeInfoXml(value);
  }

  get episode() {
    return Number(this.value.find('episode').text());
  }

  get plot() {
    return this.value.find('plot').text() || undefined;
  }

  get season() {
    return Number(this.value.find('season').text());
  }
  
  get title() {
    return this.value.find('title').text();
  }
}
