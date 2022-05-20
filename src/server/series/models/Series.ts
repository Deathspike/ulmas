import * as clv from 'class-validator';
import {SeriesXml} from './SeriesXml';
import fs from 'fs';
import path from 'path';

export class Series {
  constructor(seriesXml: SeriesXml) {
    this.seasons = seriesXml.seasons;
    this.synopsis = seriesXml.synopsis;
    this.title = seriesXml.title;
  }

  static async loadAsync(seriesPath: string) {
    const seriesXml = await fs.promises.readFile(path.join(seriesPath, 'tvshow.nfo')).then(SeriesXml.parseAsync);
    const series = new Series(seriesXml);
    await clv.validateOrReject(series);
    return series;
  }

  @clv.IsOptional()
  @clv.IsArray()
  @clv.IsString({each: true})
  @clv.IsNotEmpty({each: true})
  @clv.ArrayNotEmpty()
  readonly seasons?: Array<string>;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly synopsis?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly title: string;
}
