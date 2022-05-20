import * as app from '../..';
import * as clv from 'class-validator';
import {StreamMap} from '../models/StreamMap';
import fs from 'fs';
import path from 'path';

export class StreamCache {
  constructor(sectionId: string, seriesId: string) {
    this.fullPath = path.join(app.settings.paths.cache, `series.${sectionId}.${seriesId}.stream.json`);
  }

  async loadAsync() {
    const streamMapJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const streamMap = new StreamMap(JSON.parse(streamMapJson));
    await clv.validateOrReject(streamMap);
    return streamMap;
  }

  async saveAsync(streamMap: StreamMap) {
    await clv.validateOrReject(streamMap);
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(`${this.fullPath}.tmp`, streamMap.toJson());
    await fs.promises.rename(`${this.fullPath}.tmp`, this.fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
