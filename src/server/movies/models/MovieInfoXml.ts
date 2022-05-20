import xml2js from 'xml2js';

export class MovieInfoXml {
  private constructor(
    private readonly source: ParsedXml = {}) {}

  static async parseAsync(xml: string) {
    const source = await xml2js.parseStringPromise(xml);
    return new MovieInfoXml(source);
  }

  get plot() {
    return this.source.movie
      ?.plot
      ?.find(Boolean);
  }

  get title() {
    return this.source.movie
      ?.title
      ?.find(Boolean) ?? '';
  }
}

type ParsedXml = {
  movie?: {
    plot?: Array<string>;
    title?: Array<string>;
  }
};
