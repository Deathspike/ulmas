import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';

export class SeriesCache {
  constructor(sectionId: string, seriesId: string) {
    const name = `series.${sectionId}.${seriesId}.json`;
    this.fullPath = path.join(app.settings.cache, name);
  }

  async loadAsync() {
    const seriesJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const series = new app.api.models.Series(JSON.parse(seriesJson));
    await clv.validateOrReject(series);
    return series;
  }

  async saveAsync(series: app.api.models.Series) {
    await clv.validateOrReject(series);
    const tempPath = `${this.fullPath}.tmp`;
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(tempPath, JSON.stringify(series));
    await fs.promises.rename(tempPath, this.fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
