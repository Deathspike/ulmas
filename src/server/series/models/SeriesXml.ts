import xml2js from 'xml2js';

export class SeriesXml {
  private constructor(
    private readonly source: Xml = {}) {}

  static async parseAsync(buffer: Buffer) {
    const source = await xml2js.parseStringPromise(buffer);
    return new SeriesXml(source);
  }

  get seasons() {
    return this.source.tvshow
      ?.namedseason
      ?.map(x => typeof x !== 'string' ? x : {$: {number: []}, _: x})
      ?.sort((a, b) => Number(a.$.number?.[0]) - Number(b.$.number?.[0]))
      ?.map(x => x._);
  }

  get synopsis() {
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
    namedseason?: Array<string | {$: {number: Array<string>}, _: string}>;
    plot?: Array<string>;
    title?: Array<string>;
  }
};
