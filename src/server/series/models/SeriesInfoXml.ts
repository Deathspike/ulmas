import xml2js from 'xml2js';

export class SeriesInfoXml {
  private constructor(
    private readonly value: ParsedXml = {}) {}

  static async parseAsync(xml: string) {
    const value = await xml2js.parseStringPromise(xml);
    return new SeriesInfoXml(value);
  }

  get plot() {
    return this.value.tvshow
      ?.plot
      ?.find(Boolean);
  }

  get title() {
    return this.value.tvshow
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
