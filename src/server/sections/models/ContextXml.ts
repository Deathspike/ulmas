import xml2js from 'xml2js';

export class ContextXml {
  constructor(
    private readonly source: ParsedXml = {}) {}

  static async parseAsync(buffer: Buffer) {
    const source = await xml2js.parseStringPromise(buffer);
    return new ContextXml(source);
  }

  get sections() {
    return this.source.sections?.section?.map(x => ({
      id: x.id?.find(Boolean) ?? '',
      paths: x.path ?? [],
      title: x.title?.find(Boolean) ?? '',
      type: x.type?.find(Boolean) ?? ''
    })) ?? [];
  }

  set sections(sections) {
    this.source.sections ??= {};
    this.source.sections.section = sections?.map(x => ({id: [x.id], path: x.paths, title: [x.title], type: [x.type]}));
  }

  toString() {
    return new xml2js.Builder().buildObject(this.source);
  }
}

type ParsedXml = {
  sections?: {
    section?: Array<{
      id?: Array<string>,
      path?: Array<string>,
      title?: Array<string>,
      type?: Array<string>
    }>
  }
};
