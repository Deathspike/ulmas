import * as cheerio from 'cheerio';
import {DateTime} from 'luxon';
import xmlFormatter from 'xml-formatter';

export class EpisodeInfoXml {
  private constructor(private readonly $: cheerio.CheerioAPI) {}

  static async parseAsync(xml: string) {
    const $ = cheerio.load(xml, {xml: {decodeEntities: false}});
    return new EpisodeInfoXml($);
  }

  get episode() {
    const selector = this.$('episodedetails > episode');
    const value = Number(selector.first().text());
    return isFinite(value) ? value : -1;
  }

  get season() {
    const selector = this.$('episodedetails > season');
    const value = Number(selector.first().text());
    return isFinite(value) ? value : -1;
  }

  get title() {
    const selector = this.$('episodedetails > title');
    const value = selector.first().text();
    return value.length ? cheerio.load(value).text() : '';
  }

  get dateAdded() {
    const selector = this.$('episodedetails > dateadded');
    const value = selector.first().text();
    return value.length ? toISO(DateTime.fromSQL(value)) : undefined;
  }

  get lastPlayed() {
    const selector = this.$('episodedetails > lastplayed');
    const value = selector.first().text();
    return value.length ? toISO(DateTime.fromSQL(value)) : undefined;
  }

  set lastPlayed(isoValue: string | undefined) {
    const selector = this.$('episodedetails > lastplayed');
    const value = isoValue && toXML(DateTime.fromISO(isoValue));
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('episodedetails').prepend(`<lastplayed>${value}</lastplayed>`);
    } else {
      selector.first().text(value);
    }
  }

  get playCount() {
    const selector = this.$('episodedetails > playcount');
    const value = selector.first().text();
    return value ? Number(value) || 0 : undefined;
  }

  set playCount(value: number | undefined) {
    const selector = this.$('episodedetails > playcount');
    if (typeof value === 'undefined') {
      selector.first().remove();
    } else if (!selector.length) {
      this.$('episodedetails').prepend(`<playcount>${value}</playcount>`);
    } else {
      selector.first().text(String(value));
    }
  }

  get plot() {
    const selector = this.$('episodedetails > plot');
    const value = selector.first().text();
    return value.length ? cheerio.load(value).text() : undefined;
  }

  get resume() {
    const positionSelector = this.$('episodedetails > resume > position');
    const position = Number(positionSelector.first().text());
    const totalSelector = this.$('episodedetails > resume > total');
    const total = Number(totalSelector.first().text());
    return position && total ? {position, total} : undefined;
  }

  set resume(value: {position: number; total: number} | undefined) {
    const selector = this.$('episodedetails > resume');
    if (!value) {
      selector.first().remove();
    } else if (!selector.length) {
      const element = `<resume><position>${value.position}</position><total>${value.total}</total></resume>`;
      this.$('episodedetails').prepend(element);
    } else {
      const element = `<resume><position>${value.position}</position><total>${value.total}</total></resume>`;
      selector.replaceWith(element);
    }
  }

  get watched() {
    const selector = this.$('episodedetails > watched');
    const value = selector.first().text();
    return value.length ? /^true$/i.test(value) : undefined;
  }

  set watched(value: boolean | undefined) {
    const selector = this.$('episodedetails > watched');
    if (typeof value === 'undefined') {
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

function toISO(date: DateTime) {
  return date.toUTC().toISO({suppressMilliseconds: true});
}

function toXML(date: DateTime) {
  return date.toFormat('yyyy-MM-dd HH:mm:ss');
}
