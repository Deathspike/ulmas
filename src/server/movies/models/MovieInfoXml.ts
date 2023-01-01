import * as cheerio from 'cheerio';
import {DateTime} from 'luxon';
import xmlFormatter from 'xml-formatter';

export class MovieInfoXml {
  private constructor(private readonly $: cheerio.CheerioAPI) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: {decodeEntities: false}});
    return new MovieInfoXml($);
  }

  get title() {
    const selector = this.$('movie > title');
    const value = selector.first().text();
    return value.length ? cheerio.load(value).text() : '';
  }

  get dateAdded() {
    const selector = this.$('movie > dateadded');
    const value = selector.first().text();
    return value.length ? toISO(DateTime.fromSQL(value)) : undefined;
  }

  get lastPlayed() {
    const selector = this.$('movie > lastplayed');
    const value = selector.first().text();
    return value.length ? toISO(DateTime.fromSQL(value)) : undefined;
  }

  set lastPlayed(isoValue: string | undefined) {
    const selector = this.$('movie > lastplayed');
    const value = isoValue && toXML(DateTime.fromISO(isoValue));
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('movie').prepend(`<lastplayed>${value}</lastplayed>`);
    } else {
      selector.first().text(value);
    }
  }

  get playCount() {
    const selector = this.$('movie > playcount');
    const value = selector.first().text();
    return value ? Number(value) || 0 : undefined;
  }

  set playCount(value: number | undefined) {
    const selector = this.$('movie > playcount');
    if (typeof value === 'undefined') {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('movie').prepend(`<playcount>${value}</playcount>`);
    } else {
      selector.first().text(String(value));
    }
  }

  get plot() {
    const selector = this.$('movie > plot');
    const value = selector.first().text();
    return value.length ? cheerio.load(value).text() : undefined;
  }

  get resume() {
    const positionSelector = this.$('movie > resume > position');
    const position = Number(positionSelector.first().text());
    const totalSelector = this.$('movie > resume > total');
    const total = Number(totalSelector.first().text());
    return position && total ? {position, total} : undefined;
  }

  set resume(value: {position: number; total: number} | undefined) {
    const selector = this.$('movie > resume');
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      const element = `<resume><position>${value.position}</position><total>${value.total}</total></resume>`;
      this.$('movie').prepend(element);
    } else {
      const element = `<resume><position>${value.position}</position><total>${value.total}</total></resume>`;
      selector.replaceWith(element);
    }
  }

  get watched() {
    const selector = this.$('movie > watched');
    const value = selector.first().text();
    return value.length ? /^true$/i.test(value) : undefined;
  }

  set watched(value: boolean | undefined) {
    const selector = this.$('movie > watched');
    if (typeof value === 'undefined') {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('movie').prepend(`<watched>${value}</watched>`);
    } else {
      selector.first().text(String(value));
    }
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
