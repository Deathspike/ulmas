import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import {ContextXml} from './ContextXml';
import {Section} from './Section';
import fs from 'fs';
import path from 'path';

export class Context {
  constructor(contextXml?: Context) {
    this.sections = contextXml?.sections.map(x => new Section(x)) ?? [];
  }
  
  static async loadAsync(fullPath: string) {
    const contextXml = await getOrCreateAsync(fullPath);
    const context = new Context(contextXml);
    await clv.validateOrReject(context);
    return context;
  }

  static async saveAsync(fullPath: string, context: Context) {
    await clv.validateOrReject(context);  
    const contextXml = await getOrCreateAsync(fullPath);
    contextXml.sections = context.sections;
    await fs.promises.mkdir(path.dirname(fullPath), {recursive: true});
    await fs.promises.writeFile(fullPath, contextXml.toString());
  }

  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Section)
  readonly sections: Array<Section>;
}

async function getOrCreateAsync(fullPath: string) {
  return await fs.promises.readFile(fullPath)
    .then(ContextXml.parseAsync)
    .catch(() => new ContextXml());
}
