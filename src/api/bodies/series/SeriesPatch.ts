import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {EpisodePatch} from './EpisodePatch';

export class SeriesPatch {
  constructor(source?: SeriesPatch) {
    this.episodes = source?.episodes ?? [];
  }
  
  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => EpisodePatch)
  @swg.ApiProperty({type: [EpisodePatch]})
  readonly episodes: Array<EpisodePatch>;
}
