import * as clv from 'class-validator';
import {EpisodeInfoXml} from './EpisodeInfoXml';
import fs from 'fs';

export class EpisodeInfo {
  constructor(episodeXml?: EpisodeInfo) {
    this.episode = episodeXml?.episode ?? NaN;
    this.plot = episodeXml?.plot;
    this.season = episodeXml?.season ?? NaN;
    this.title = episodeXml?.title ?? '';
  }

  static async loadAsync(fullPath: string) {
    const episodeXml = await fs.promises.readFile(fullPath, 'utf-8').then(EpisodeInfoXml.parseAsync);
    const episode = new EpisodeInfo(episodeXml);
    await clv.validateOrReject(episode);
    return episode;
  }

  @clv.IsNumber()
  @clv.Min(1)
  readonly episode: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly plot?: string;

  @clv.IsNumber()
  @clv.Min(0)
  readonly season: number;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly title: string;
}
