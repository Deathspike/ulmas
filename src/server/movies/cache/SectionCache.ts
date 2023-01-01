import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';
import MovieEntry = app.api.models.MovieEntry;

export class SectionCache {
  constructor(sectionId: string) {
    const name = `movies.${sectionId}.json`;
    this.fullPath = path.join(app.settings.cache, name);
  }

  async loadAsync() {
    const sectionJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const sectionRoot: Array<MovieEntry> = JSON.parse(sectionJson);
    const section = sectionRoot.map(x => new MovieEntry(x));
    await Promise.all(section.map(x => clv.validateOrReject(x)));
    return section;
  }

  async saveAsync(section: Array<MovieEntry>) {
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
