import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';

export class SectionCache {
  constructor(sectionId: string) {
    this.fullPath = path.join(app.settings.cache, `movies.${sectionId}.json`);
  }

  async loadAsync() {
    const sectionJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const sectionRoot: Array<app.api.models.MovieEntry> = JSON.parse(sectionJson);
    const section = sectionRoot.map(x => new app.api.models.MovieEntry(x));
    await clv.validateOrReject(section);
    return section;
  }

  async saveAsync(section: Array<app.api.models.MovieEntry>) {
    await clv.validateOrReject(section);
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(`${this.fullPath}.tmp`, JSON.stringify(section));
    await fs.promises.rename(`${this.fullPath}.tmp`, this.fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
