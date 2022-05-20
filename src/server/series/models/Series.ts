import * as clv from 'class-validator';
import {SeriesXml} from './SeriesXml';
import fs from 'fs';

export class Series {
  constructor(seriesXml: SeriesXml) {
    this.plot = seriesXml.plot;
    this.title = seriesXml.title;
  }

  static async loadAsync(filePath: string) {
    const seriesXml = await fs.promises.readFile(filePath, 'utf-8').then(SeriesXml.parseAsync);
    const series = new Series(seriesXml);
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
