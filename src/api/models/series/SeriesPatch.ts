import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {Episode} from './Episode';
import {EpisodePatch} from './EpisodePatch';
import {MediaResume} from '../MediaResume';

export class SeriesPatch {
  constructor(source?: SeriesPatch) {
    this.episodes = source?.episodes.map(x => new EpisodePatch(x)) ?? [];
  }
  
  static create(source: Array<Episode> | Episode, value: MediaResume | boolean) {
    const episodes = new Array<Episode>()
      .concat(source)
      .map(x => EpisodePatch.create(x, value));
    return new SeriesPatch({episodes});
  }

  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => EpisodePatch)
  @swg.ApiProperty({type: [EpisodePatch]})
  readonly episodes: Array<EpisodePatch>;
}
