import * as clv from 'class-validator';
import {EpisodeXml} from './EpisodeXml';
import fs from 'fs';

export class Episode {
  constructor(episodeXml: EpisodeXml) {
    this.episode = episodeXml.episode;
    this.plot = episodeXml.plot;
    this.season = episodeXml.season;
    this.title = episodeXml.title;
  }

  static async loadAsync(filePath: string) {
    const episodeXml = await fs.promises.readFile(filePath).then(EpisodeXml.parseAsync);
    const episode = new Episode(episodeXml);
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
