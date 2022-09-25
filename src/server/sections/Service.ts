import * as app from '..';
import * as nst from '@nestjs/common';
import {Context} from './models/Context';
import {Section} from './models/Section';

@nst.Injectable()
export class Service {
  private context?: Context;

  constructor(
    private readonly eventService: app.core.EventService) {}

  async createAsync(paths: Array<string>, title: string, type: string) {
    const id = Date.now().toString(16);
    this.context ??= await Context.loadAsync(app.settings.sections);
    this.context.sections.push(new Section({id, paths, title, type}));
    await Context.saveAsync(app.settings.sections, this.context);
    await this.eventService.sendAsync('sections', id);
  }

  async deleteAsync(section: Section) {
    this.context ??= await Context.loadAsync(app.settings.sections);
    this.context.sections.splice(this.context.sections.findIndex(x => x.id === section.id), 1);
    await Context.saveAsync(app.settings.sections, this.context);
    await this.eventService.sendAsync('sections', section.id);
  }

  async readAsync() {
    this.context ??= await Context.loadAsync(app.settings.sections);
    this.context.sections.sort((a, b) => a.title.localeCompare(b.title));
    return this.context.sections;
  }

  async updateAsync(section: Section) {
    this.context ??= await Context.loadAsync(app.settings.sections);
    this.context.sections.splice(this.context.sections.findIndex(x => x.id === section.id), 1, section);
    await Context.saveAsync(app.settings.sections, this.context);
    await this.eventService.sendAsync('sections', section.id);
  }
}
