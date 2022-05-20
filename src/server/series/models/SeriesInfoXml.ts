import xml2js from 'xml2js';

export class SeriesInfoXml {
  private constructor(
    private readonly source: ParsedXml = {}) {}

  static async parseAsync(xml: string) {
    const source = await xml2js.parseStringPromise(xml);
    return new SeriesInfoXml(source);
  }

  get plot() {
    return this.source.tvshow
      ?.plot
      ?.find(Boolean);
  }

  get title() {
    return this.source.tvshow
      ?.title
      ?.find(Boolean) ?? '';
  }
}

type ParsedXml = {
  tvshow?: {
    plot?: Array<string>;
    title?: Array<string>;
  }
};
