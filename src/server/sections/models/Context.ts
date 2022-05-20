import * as app from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import {ContextXml} from './ContextXml';
import fs from 'fs';
import path from 'path';

export class Context {
  constructor(contextXml: ContextXml) {
    this.sections = contextXml.sections.map(x => new app.api.models.Section(x));
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
    app.mergeProperties(context, contextXml);
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
    await fs.promises.writeFile(filePath, contextXml.toString());
  }

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => app.api.models.Section)
  readonly sections: Array<app.api.models.Section>;
}

async function getOrCreateAsync(filePath: string) {
  return await fs.promises.readFile(filePath)
    .then(ContextXml.parseAsync)
    .catch(() => new ContextXml());
}
