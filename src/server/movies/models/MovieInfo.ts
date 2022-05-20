import * as app from '../..';
import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import {MovieInfoXml} from './MovieInfoXml';
import fs from 'fs';

export class MovieInfo {
  constructor(movieInfo?: MovieInfo) {
    this.title = movieInfo?.title ?? '';
    this.dateAdded = movieInfo?.dateAdded;
    this.lastPlayed = movieInfo?.lastPlayed;
    this.playCount = movieInfo?.playCount;
    this.plot = movieInfo?.plot;
    this.resume = movieInfo?.resume && new app.api.models.MediaStatus(movieInfo.resume);
    this.watched = movieInfo?.watched;
  }

  static async loadAsync(fullPath: string) {
    const movieInfoXml = await fs.promises.readFile(fullPath, 'utf-8').then(MovieInfoXml.parseAsync);
    const movieInfo = new MovieInfo(movieInfoXml);
    await clv.validateOrReject(movieInfo);
    return movieInfo;
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
  @clv.IsNumber()
  @clv.Min(1)
  readonly playCount?: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly plot?: string;

  @clv.IsOptional()
  @clv.ValidateNested()
  @clt.Type(() => app.api.models.MediaStatus)
  readonly resume?: app.api.models.MediaStatus;

  @clv.IsOptional()
  @clv.IsBoolean()
  readonly watched?: boolean;
}
