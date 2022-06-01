import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';

export class SectionCache {
  constructor(sectionId: string) {
    this.fullPath = path.join(app.settings.cache, `series.${sectionId}.json`);
  }

  async loadAsync() {
    const sectionJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const sectionRoot: Array<app.api.models.SeriesEntry> = JSON.parse(sectionJson);
    const section = sectionRoot.map(x => new app.api.models.SeriesEntry(x));
    await Promise.all(section.map(x => clv.validateOrReject(x)));
    return section;
  }

  async saveAsync(section: Array<app.api.models.SeriesEntry>) {
    await Promise.all(section.map(x => clv.validateOrReject(x)));
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(`${this.fullPath}.tmp`, JSON.stringify(section));
    await fs.promises.rename(`${this.fullPath}.tmp`, this.fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
