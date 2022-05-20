import * as app from '..';
import * as nst from '@nestjs/common';
import {Context} from './models/Context';
import path from 'path';
import os from 'os';

@nst.Injectable()
export class Service {
  private context?: Context;

  async createAsync(section: app.api.models.Section) {
    this.context ??= await Context.loadAsync(getContextPath());
    this.context.sections.push(section);
    await Context.saveAsync(getContextPath(), this.context);
  }

  async deleteAsync(section: app.api.models.Section) {
    this.context ??= await Context.loadAsync(getContextPath());
    this.context.sections.splice(this.context.sections.findIndex(x => x.id === section.id), 1);
    await Context.saveAsync(getContextPath(), this.context);
  }

  async readAsync() {
    this.context ??= await Context.loadAsync(getContextPath());
    this.context.sections.sort((a, b) => a.title.localeCompare(b.title));
    return this.context.sections;
  }

  async updateAsync(section: app.api.models.Section) {
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
