import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import {Section} from './Section';
import fs from 'fs';
import path from 'path';

export class Context {
  constructor(sections?: Array<Section>) {
    this.sections = sections?.map(x => new Section(x)) ?? [];
  }
  
  static async loadAsync(fullPath: string) {
    const contextJson = await fs.promises.readFile(fullPath, 'utf-8').catch(() => '[]');
    const context = new Context(JSON.parse(contextJson));
    await clv.validateOrReject(context);
    return context;
  }

  static async saveAsync(fullPath: string, context: Context) {
    await clv.validateOrReject(context);  
    await fs.promises.mkdir(path.dirname(fullPath), {recursive: true});
    await fs.promises.writeFile(`${fullPath}.tmp`, JSON.stringify(context.sections, null, 2));
    await fs.promises.rename(`${fullPath}.tmp`, fullPath);
  }

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Section)
  readonly sections: Array<Section>;
}
