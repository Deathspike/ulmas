import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';
import SeriesEntry = app.api.models.SeriesEntry;

export class SectionCache {
  constructor(sectionId: string) {
    const name = `series.${sectionId}.json`;
    this.fullPath = path.join(app.settings.cache, name);
  }

  async loadAsync() {
    const sectionJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const sectionRoot: Array<SeriesEntry> = JSON.parse(sectionJson);
    const section = sectionRoot.map(x => new SeriesEntry(x));
    await Promise.all(section.map(x => clv.validateOrReject(x)));
    return section;
  }

  async saveAsync(section: Array<SeriesEntry>) {
    await Promise.all(section.map(x => clv.validateOrReject(x)));
    const tempPath = `${this.fullPath}.tmp`;
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(tempPath, JSON.stringify(section));
    await fs.promises.rename(tempPath, this.fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
