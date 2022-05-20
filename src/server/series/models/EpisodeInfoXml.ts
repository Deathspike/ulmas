import * as cheerio from 'cheerio';
import {DateTime} from 'luxon';
import xmlFormatter from 'xml-formatter';

export class EpisodeInfoXml {
  private constructor(
    private readonly $: cheerio.CheerioAPI) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: true});
    return new EpisodeInfoXml($);
  }

  get episode() {
    const value = Number(this.$('episodedetails > episode')
      .first()
      .text());
    return isFinite(value)
      ? value
      : -1;
  }

  get season() {
    const value = Number(this.$('episodedetails > season')
      .first()
      .text());
    return isFinite(value)
      ? value
      : -1;
  }
  
  get title() {
    const value = this.$('episodedetails > title')
      .first()
      .text();
    return value.length
      ? value
      : '';
  }

  get dateAdded() {
    const value = this.$('episodedetails > dateadded')
      .first()
      .text();
    return value.length
      ? DateTime.fromSQL(value).toISO()
      : undefined;
  }

  get lastPlayed() {
    const value = this.$('episodedetails > lastplayed')
      .first()
      .text();
    return value.length
      ? DateTime.fromSQL(value).toISO()
      : undefined;
  }

  set lastPlayed(value: string | undefined) {
    const date = value && DateTime.fromISO(value).toFormat('yyyy-MM-dd HH:mm:ss');
    const selector = this.$('episodedetails > lastplayed');
    if (!date) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('episodedetails').prepend(`<lastplayed>${date}</lastplayed>`);
    } else {
      selector.first().text(date);
    }
  }

  get playCount() {
    const value = Number(this.$('episodedetails > playcount')
      .first()
      .text());
    return value
      ? value
      : undefined;
  }

  set playCount(value: number | undefined) {
    const selector = this.$('episodedetails > playcount');
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('episodedetails').prepend(`<playcount>${value}</playcount>`);
    } else {
      selector.first().text(String(value));
    }
  }

  get plot() {
    const value = this.$('episodedetails > plot')
      .first()
      .text();
    return value.length
      ? value
      : undefined;
  }

  get resume() {
    const position = Number(this.$('episodedetails > resume > position')
      .first()
      .text());
    const total = Number(this.$('episodedetails > resume > total')
      .first()
      .text());
    return position && total
      ? {position, total}
      : undefined;
  }

  set resume(value: {position: number, total: number} | undefined) {
    const selector = this.$('episodedetails > resume');
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('episodedetails').prepend(`<resume><position>${value.position}</position><total>${value.total}</total></resume>`);
    } else {
      selector.replaceWith(`<resume><position>${value.position}</position><total>${value.total}</total></resume>`);
    }
  }

  get watched() {
    const value = this.$('episodedetails > watched')
      .first()
      .text();
    return value.length && /^true$/i.test(value)
      ? true
      : undefined;
  }

  set watched(value: boolean | undefined) {
    const selector = this.$('episodedetails > watched');
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('episodedetails').prepend(`<watched>${value}</watched>`);
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
