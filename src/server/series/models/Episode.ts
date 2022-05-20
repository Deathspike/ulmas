import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import {EpisodeXml} from './EpisodeXml';
import fs from 'fs';

export class Episode {
  constructor(episodeXml: EpisodeXml) {
    this.number = episodeXml.number;
    this.synopsis = episodeXml.synopsis;
    this.title = episodeXml.title;
  }

  static async loadAsync(episodePath: string) {
    const episodeXml = await fs.promises.readFile(`${episodePath}.nfo`).then(EpisodeXml.parseAsync);
    const episode = new Episode(episodeXml);
    await clv.validateOrReject(episode);
    return episode;
  }

  @clv.IsNumber()
  @clv.Min(1)
  @clt.Type(() => Number)
  readonly number: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly synopsis?: string;
  
  @clv.IsOptional()
  @clv.IsString()
  readonly title?: string;
}
