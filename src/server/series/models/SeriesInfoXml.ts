import * as cheerio from 'cheerio';
import {DateTime} from 'luxon';
import xmlFormatter from 'xml-formatter';

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
      ? DateTime.fromSQL(value).toUTC().toISO({suppressMilliseconds: true})
      : undefined;
  }

  get lastPlayed() {
    const value = this.$('tvshow > lastplayed')
      .first()
      .text();
    return value.length
      ? DateTime.fromSQL(value).toUTC().toISO({suppressMilliseconds: true})
      : undefined;
  }

  set lastPlayed(value: string | undefined) {
    const date = value && DateTime.fromISO(value).toFormat('yyyy-MM-dd HH:mm:ss');
    const selector = this.$('tvshow > lastplayed');
    if (!date) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('tvshow').prepend(`<lastplayed>${date}</lastplayed>`);
    } else {
      selector.first().text(date);
    }
  }
  
  get plot() {
    const value = this.$('tvshow > plot')
      .first()
      .text();
    return value.length
      ? value
      : undefined;
  }

  toString() {
    return xmlFormatter(this.$.xml(), {
      collapseContent: true,
      indentation: '  '
    });
  }
}
