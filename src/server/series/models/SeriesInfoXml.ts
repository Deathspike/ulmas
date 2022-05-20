import * as cheerio from 'cheerio';
import {DateTime} from 'luxon';

export class SeriesInfoXml {
  private constructor(
    private readonly $: cheerio.CheerioAPI) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: true});
    return new SeriesInfoXml($);
  }

  get title() {
    const value = this.$('tvshow > title')
      .first()
      .text();
    return value.length
      ? value
      : '';
  }

  get dateAdded() {
    const value = this.$('tvshow > dateadded')
      .first()
      .text();
    return value.length
      ? DateTime.fromSQL(value).toISO()
      : undefined;
  }

  get plot() {
    const value = this.$('tvshow > plot')
      .first()
      .text();
    return value.length
      ? value
      : undefined;
  }
}
