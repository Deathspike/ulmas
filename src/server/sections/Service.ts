import * as nst from '@nestjs/common';
import {Context} from './models/Context';
import {Section} from './models/Section';
import path from 'path';
import os from 'os';

@nst.Injectable()
export class Service {
  private context?: Context;

  async createAsync(paths: Array<string>, title: string, type: string) {
    const id = Date.now().toString(16);
    this.context ??= await Context.loadAsync(getContextPath());
    this.context.sections.push(new Section({id, paths, title, type}));
    await Context.saveAsync(getContextPath(), this.context);
  }

  async deleteAsync(section: Section) {
    this.context ??= await Context.loadAsync(getContextPath());
    this.context.sections.splice(this.context.sections.findIndex(x => x.id === section.id), 1);
    await Context.saveAsync(getContextPath(), this.context);
  }

  async readAsync(sectionType?: string) {
    this.context ??= await Context.loadAsync(getContextPath());
    this.context.sections.sort((a, b) => a.title.localeCompare(b.title));
    return sectionType ? this.context.sections.filter(x => x.type === sectionType) : this.context.sections;
  }

  async updateAsync(section: Section) {
    this.context ??= await Context.loadAsync(getContextPath());
    this.context.sections.splice(this.context.sections.findIndex(x => x.id === section.id), 1, section);
    await Context.saveAsync(getContextPath(), this.context);
  }
}

function getContextPath() {
  const packageData = require('../../../package');
  const rootPath = path.join(os.homedir(), packageData.name);
  return path.join(rootPath, 'sections.xml');
}
