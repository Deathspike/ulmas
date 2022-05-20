import xml2js from 'xml2js';

export class SeriesXml {
  private constructor(
    private readonly source: Xml = {}) {}

  static async parseAsync(buffer: Buffer) {
    const source = await xml2js.parseStringPromise(buffer);
    return new SeriesXml(source);
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

type Xml = {
  tvshow?: {
    plot?: Array<string>;
    title?: Array<string>;
  }
};
