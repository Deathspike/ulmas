import * as clv from 'class-validator';
import {SeriesInfoXml} from './SeriesInfoXml';
import fs from 'fs';

export class SeriesInfo {
  constructor(seriesInfo?: SeriesInfo) {
    this.title = seriesInfo?.title ?? '';
    this.dateAdded = seriesInfo?.dateAdded;
    this.plot = seriesInfo?.plot;
  }

  static async loadAsync(fullPath: string) {
    const seriesInfoXml = await fs.promises.readFile(fullPath, 'utf-8').then(SeriesInfoXml.parseAsync);
    const seriesInfo = new SeriesInfo(seriesInfoXml);
    await clv.validateOrReject(seriesInfo);
    return seriesInfo;
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly title: string;

  @clv.IsOptional()
  @clv.IsDateString()
  readonly dateAdded?: string;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly plot?: string;
}
