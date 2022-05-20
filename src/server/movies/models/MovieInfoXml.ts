import * as cheerio from 'cheerio';
import {DateTime} from 'luxon';
import xmlFormatter from 'xml-formatter';

export class MovieInfoXml {
  private constructor(
    private readonly $: cheerio.CheerioAPI) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: true});
    return new MovieInfoXml($);
  }

  get title() {
    const value = this.$('movie > title')
      .first()
      .text();
    return value.length
      ? value
      : '';
  }

  get dateAdded() {
    const value = this.$('movie > dateadded')
      .first()
      .text();
    return value.length
      ? DateTime.fromSQL(value).toISO()
      : undefined;
  }

  get lastPlayed() {
    const value = this.$('movie > lastplayed')
      .first()
      .text();
    return value.length
      ? DateTime.fromSQL(value).toISO()
      : undefined;
  }

  set lastPlayed(value: string | undefined) {
    const date = value && DateTime.fromISO(value).toFormat('yyyy-MM-dd HH:mm:ss');
    const selector = this.$('movie > lastplayed');
    if (!date) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('movie').prepend(`<lastplayed>${date}</lastplayed>`);
    } else {
      selector.first().text(date);
    }
  }

  get playCount() {
    const value = Number(this.$('movie > playcount')
      .first()
      .text());
    return value
      ? value
      : undefined;
  }

  set playCount(value: number | undefined) {
    const selector = this.$('movie > playcount');
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('movie').prepend(`<playcount>${value}</playcount>`);
    } else {
      selector.first().text(String(value));
    }
  }

  get plot() {
    const value = this.$('movie > plot')
      .first()
      .text();
    return value.length
      ? value
      : undefined;
  }

  get resume() {
    const position = Number(this.$('movie > resume > position')
      .first()
      .text());
    const total = Number(this.$('movie > resume > total')
      .first()
      .text());
    return position && total
      ? {position, total}
      : undefined;
  }

  set resume(value: {position: number, total: number} | undefined) {
    const selector = this.$('movie > resume');
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('movie').prepend(`<resume><position>${value.position}</position><total>${value.total}</total></resume>`);
    } else {
      selector.replaceWith(`<resume><position>${value.position}</position><total>${value.total}</total></resume>`);
    }
  }

  get watched() {
    const value = this.$('movie > watched')
      .first()
      .text();
    return value.length && /^true$/i.test(value)
      ? true
      : undefined;
  }

  set watched(value: boolean | undefined) {
    const selector = this.$('movie > watched');
    if (!value) {
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
