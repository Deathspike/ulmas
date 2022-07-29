import * as app from '../..';
import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import {MovieInfoXml} from './MovieInfoXml';
import fs from 'fs';
import path from 'path';

export class MovieInfo {
  constructor(movieInfo?: MovieInfo) {
    this.title = movieInfo?.title ?? '';
    this.dateAdded = movieInfo?.dateAdded;
    this.lastPlayed = movieInfo?.lastPlayed;
    this.playCount = movieInfo?.playCount;
    this.plot = movieInfo?.plot;
    this.resume = movieInfo?.resume && new app.api.models.MediaResume(movieInfo.resume);
    this.watched = movieInfo?.watched;
  }

  static async loadAsync(fullPath: string) {
    const movieInfoXml = await fs.promises.readFile(fullPath, 'utf-8').then(MovieInfoXml.parseAsync);
    const movieInfo = new MovieInfo(movieInfoXml);
    await clv.validateOrReject(movieInfo);
    return movieInfo;
  }

  static async saveAsync<T extends MovieInfo>(fullPath: string, movieInfo: T) {
    await clv.validateOrReject(movieInfo);
    const movieInfoXml = await fs.promises.readFile(fullPath, 'utf-8').then(MovieInfoXml.parseAsync);
    merge(movieInfo, movieInfoXml);
    await fs.promises.mkdir(path.dirname(fullPath), {recursive: true});
    await fs.promises.writeFile(`${fullPath}.tmp`, movieInfoXml.toString());
    await fs.promises.rename(`${fullPath}.tmp`, fullPath);
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
  @clv.Min(0)
  readonly playCount?: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly plot?: string;

  @clv.IsOptional()
  @clv.ValidateNested()
  @clt.Type(() => app.api.models.MediaResume)
  readonly resume?: app.api.models.MediaResume;

  @clv.IsOptional()
  @clv.IsBoolean()
  readonly watched?: boolean;
}

function merge(movieInfo: MovieInfo, movieInfoXml: MovieInfoXml) {
  movieInfoXml.lastPlayed = movieInfo.lastPlayed;
  movieInfoXml.playCount = movieInfo.playCount;
  movieInfoXml.resume = movieInfo.resume;
  movieInfoXml.watched = movieInfo.watched;
}
