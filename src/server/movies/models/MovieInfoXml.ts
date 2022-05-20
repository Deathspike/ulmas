import xml2js from 'xml2js';

export class MovieInfoXml {
  private constructor(
    private readonly value: ParsedXml = {}) {}

  static async parseAsync(xml: string) {
    const value = await xml2js.parseStringPromise(xml);
    return new MovieInfoXml(value);
  }

  get plot() {
    return this.value.movie
      ?.plot
      ?.find(Boolean);
  }

  get title() {
    return this.value.movie
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
