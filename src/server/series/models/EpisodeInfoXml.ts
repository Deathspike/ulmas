import xml2js from 'xml2js';

export class EpisodeInfoXml {
  private constructor(
    private readonly value: ParsedXml = {}) {}

  static async parseAsync(xml: string) {
    const value = await xml2js.parseStringPromise(xml);
    return new EpisodeInfoXml(value);
  }

  get episode() {
    return this.value.episodedetails
      ?.episode
      ?.map(Number)
      ?.find(Boolean) ?? 0;
  }

  get plot() {
    return this.value.episodedetails
      ?.plot
      ?.find(Boolean);
  }

  get season() {
    return this.value.episodedetails
      ?.season
      ?.map(Number)
      ?.find(Boolean) ?? 0;
  }
  
  get title() {
    return this.value.episodedetails
      ?.title
      ?.find(Boolean) ?? '';
  }
}

type ParsedXml = {
  episodedetails?: {
    episode?: Array<string>;
    plot?: Array<string>;
    season?: Array<string>;
    title?: Array<string>;
  }
};
