import xml2js from 'xml2js';

export class ContextXml {
  constructor(
    private readonly value: ParsedXml = {}) {}

  static async parseAsync(buffer: Buffer) {
    const value = await xml2js.parseStringPromise(buffer);
    return new ContextXml(value);
  }

  get sections() {
    return this.value.sections?.section?.map(x => ({
      id: x.id?.find(Boolean) ?? '',
      paths: x.path ?? [],
      title: x.title?.find(Boolean) ?? '',
      type: x.type?.find(Boolean) ?? ''
    })) ?? [];
  }

  set sections(sections) {
    this.value.sections ??= {};
    this.value.sections.section = sections?.map(x => ({id: [x.id], path: x.paths, title: [x.title], type: [x.type]}));
  }

  toString() {
    return new xml2js.Builder().buildObject(this.value);
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
