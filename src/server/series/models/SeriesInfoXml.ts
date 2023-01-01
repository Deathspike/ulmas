import * as cheerio from 'cheerio';
import {DateTime} from 'luxon';
import xmlFormatter from 'xml-formatter';

export class SeriesInfoXml {
  private constructor(private readonly $: cheerio.CheerioAPI) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: {decodeEntities: false}});
    return new SeriesInfoXml($);
  }

  get title() {
    const selector = this.$('tvshow > title');
    const value = selector.first().text();
    return value.length ? cheerio.load(value).text() : '';
  }

  get dateAdded() {
    const selector = this.$('tvshow > dateadded');
    const value = selector.first().text();
    return value.length ? toISO(DateTime.fromSQL(value)) : undefined;
  }

  get lastPlayed() {
    const selector = this.$('tvshow > lastplayed');
    const value = selector.first().text();
    return value.length ? toISO(DateTime.fromSQL(value)) : undefined;
  }

  set lastPlayed(isoValue: string | undefined) {
    const selector = this.$('tvshow > lastplayed');
    const value = isoValue && toXML(DateTime.fromISO(isoValue));
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('tvshow').prepend(`<lastplayed>${value}</lastplayed>`);
    } else {
      selector.first().text(value);
    }
  }

  get plot() {
    const selector = this.$('tvshow > plot');
    const value = selector.first().text();
    return value.length ? cheerio.load(value).text() : undefined;
  }

  toString() {
    return xmlFormatter(this.$.xml(), {
      collapseContent: true,
      indentation: '  '
    });
  }
}

function toISO(date: DateTime) {
  return date.toUTC().toISO({suppressMilliseconds: true});
}

function toXML(date: DateTime) {
  return date.toFormat('yyyy-MM-dd HH:mm:ss');
}
