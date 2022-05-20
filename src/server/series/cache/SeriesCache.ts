import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';

export class SeriesCache {
  constructor(sectionId: string, seriesId: string) {
    this.fullPath = path.join(app.settings.paths.cache, `series.${sectionId}.${seriesId}.json`);
  }

  async loadAsync() {
    const seriesJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const series = new app.api.models.Series(JSON.parse(seriesJson));
    await clv.validateOrReject(series);
    return series;
  }

  async saveAsync(series: app.api.models.Series) {
    await clv.validateOrReject(series);
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(`${this.fullPath}.tmp`, JSON.stringify(series));
    await fs.promises.rename(`${this.fullPath}.tmp`, this.fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
