import xml2js from 'xml2js';

export class MovieXml {
  private constructor(
    private readonly source: Xml = {}) {}

  static async parseAsync(buffer: Buffer) {
    const source = await xml2js.parseStringPromise(buffer);
    return new MovieXml(source);
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

type Xml = {
  movie?: {
    plot?: Array<string>;
    title?: Array<string>;
  }
};
