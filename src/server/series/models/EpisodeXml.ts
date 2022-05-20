import xml2js from 'xml2js';

export class EpisodeXml {
  private constructor(
    private readonly source: ParsedXml = {}) {}

  static async parseAsync(xml: string) {
    const source = await xml2js.parseStringPromise(xml);
    return new EpisodeXml(source);
  }

  get episode() {
    return this.source.episodedetails
      ?.episode
      ?.map(Number)
      ?.find(Boolean) ?? 0;
  }

  get plot() {
    return this.source.episodedetails
      ?.plot
      ?.find(Boolean);
  }

  get season() {
    return this.source.episodedetails
      ?.season
      ?.map(Number)
      ?.find(Boolean) ?? 0;
  }
  
  get title() {
    return this.source.episodedetails
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
