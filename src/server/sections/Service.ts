import * as app from '..';
import * as nst from '../../nest';
import {Context} from './models/Context';
import path from 'path';
import os from 'os';

@nst.Injectable()
export class Service {
  async sectionListAsync() {
    const context = await Context.loadAsync(getContextPath());
    context.sections.sort((a, b) => a.title.localeCompare(b.title));
    return context.sections;
  }
  
  async createAsync(section: app.api.models.Section) {
    const context = await Context.loadAsync(getContextPath());
    context.sections.push(section);
    await Context.saveAsync(getContextPath(), context);
  }

  async deleteAsync(section: app.api.models.Section) {
    const context = await Context.loadAsync(getContextPath());
    const index = context.sections.findIndex(x => x.id === section.id);
    if (index < 0) return;
    context.sections.splice(index, 1);
    await Context.saveAsync(getContextPath(), context);
  }

  async updateAsync(section: app.api.models.Section) {
    const context = await Context.loadAsync(getContextPath());
    const index = context.sections.findIndex(x => x.id === section.id);
    if (index < 0) return;
    context.sections.splice(index, 1, section);
    await Context.saveAsync(getContextPath(), context);
  }
}

function getContextPath() {
  const packageData = require('../../../package');
  const rootPath = path.join(os.homedir(), packageData.name);
  return path.join(rootPath, 'sections.xml');
}
