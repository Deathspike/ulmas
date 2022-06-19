import * as clv from 'class-validator';
import {SeriesInfoXml} from './SeriesInfoXml';
import fs from 'fs';
import path from 'path';

export class SeriesInfo {
  constructor(seriesInfo?: SeriesInfo) {
    this.title = seriesInfo?.title ?? '';
    this.dateAdded = seriesInfo?.dateAdded;
    this.lastPlayed = seriesInfo?.lastPlayed;
    this.plot = seriesInfo?.plot;
  }

  static async loadAsync(fullPath: string) {
    const seriesInfoXml = await fs.promises.readFile(fullPath, 'utf-8').then(SeriesInfoXml.parseAsync);
    const seriesInfo = new SeriesInfo(seriesInfoXml);
    await clv.validateOrReject(seriesInfo);
    return seriesInfo;
  }

  static async saveAsync(fullPath: string, seriesInfo: SeriesInfo) {
    await clv.validateOrReject(seriesInfo);
    const seriesInfoXml = await fs.promises.readFile(fullPath, 'utf-8').then(SeriesInfoXml.parseAsync);
    merge(seriesInfo, seriesInfoXml);
    await fs.promises.mkdir(path.dirname(fullPath), {recursive: true});
    await fs.promises.writeFile(`${fullPath}.tmp`, seriesInfoXml.toString());
    await fs.promises.rename(`${fullPath}.tmp`, fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly title: string;

  @clv.IsOptional()
  @clv.IsDateString()
  readonly dateAdded?: string;

  @clv.IsOptional()
  @clv.IsDateString()
  readonly lastPlayed?: string;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly plot?: string;
}

function merge(seriesInfo: SeriesInfo, seriesInfoXml: SeriesInfoXml) {
  seriesInfoXml.lastPlayed = seriesInfo.lastPlayed;
}
