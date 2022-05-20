import * as app from '../..';
import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import {EpisodeInfoXml} from './EpisodeInfoXml';
import fs from 'fs';

export class EpisodeInfo {
  constructor(episodeInfo?: EpisodeInfo) {
    this.episode = episodeInfo?.episode ?? NaN;
    this.season = episodeInfo?.season ?? NaN;
    this.title = episodeInfo?.title ?? '';
    this.dateAdded = episodeInfo?.dateAdded;
    this.lastPlayed = episodeInfo?.lastPlayed;
    this.playCount = episodeInfo?.playCount;
    this.plot = episodeInfo?.plot;
    this.resume = episodeInfo?.resume && new app.api.models.MediaStatus(episodeInfo.resume);
    this.watched = episodeInfo?.watched;
  }

  static async loadAsync(fullPath: string) {
    const episodeInfoXml = await fs.promises.readFile(fullPath, 'utf-8').then(EpisodeInfoXml.parseAsync);
    const episodeInfo = new EpisodeInfo(episodeInfoXml);
    await clv.validateOrReject(episodeInfo);
    return episodeInfo;
  }

  @clv.IsNumber()
  @clv.Min(1)
  readonly episode: number;

  @clv.IsNumber()
  @clv.Min(0)
  readonly season: number;
  
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
