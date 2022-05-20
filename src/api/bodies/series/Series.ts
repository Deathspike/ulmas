import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {Episode} from './Episode';

export class Series {
  constructor(source?: Series) {
    this.episodes = source?.episodes ?? [];
  }
  
  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Episode)
  @swg.ApiProperty({type: [Episode]})
  readonly episodes: Array<Episode>;
}
