import xml2js from 'xml2js';

export class EpisodeXml {
  private constructor(
    private readonly source: Xml = {}) {}

  static async parseAsync(buffer: Buffer) {
    const source = await xml2js.parseStringPromise(buffer);
    return new EpisodeXml(source);
  }

  get number() {
    return this.source.episodedetails
      ?.episode
      ?.map(Number)
      ?.find(Boolean) ?? 0;
  }

  get synopsis() {
    return this.source.episodedetails
      ?.plot
      ?.find(Boolean);
  }
  
  get title() {
    return this.source.episodedetails
      ?.title
      ?.find(Boolean);
  }
}

type Xml = {
  episodedetails?: {
    episode?: Array<string>;
    plot?: Array<string>;
    title?: Array<string>;
  }
};
