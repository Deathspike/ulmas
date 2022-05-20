import * as clv from 'class-validator';
import {SeriesInfoXml} from './SeriesInfoXml';
import fs from 'fs';

export class SeriesInfo {
  constructor(seriesXml?: SeriesInfo) {
    this.plot = seriesXml?.plot;
    this.title = seriesXml?.title ?? '';
  }

  static async loadAsync(fullPath: string) {
    const seriesXml = await fs.promises.readFile(fullPath, 'utf-8').then(SeriesInfoXml.parseAsync);
    const series = new SeriesInfo(seriesXml);
    await clv.validateOrReject(series);
    return series;
  }

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly plot?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly title: string;
}
