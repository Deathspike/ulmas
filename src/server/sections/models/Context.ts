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
  
  static async loadAsync(filePath: string) {
    const contextXml = await getOrCreateAsync(filePath);
    const context = new Context(contextXml);
    await clv.validateOrReject(context);
    return context;
  }

  static async saveAsync(filePath: string, context: Context) {
    await clv.validateOrReject(context);  
    const contextXml = await getOrCreateAsync(filePath);
    contextXml.sections = context.sections;
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
    await fs.promises.writeFile(filePath, contextXml.toString());
  }

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Section)
  readonly sections: Array<Section>;
}

async function getOrCreateAsync(filePath: string) {
  return await fs.promises.readFile(filePath)
    .then(ContextXml.parseAsync)
    .catch(() => new ContextXml());
}
