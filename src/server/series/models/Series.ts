import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as swg from '@nestjs/swagger';
import {Episode} from './Episode';
import {SeriesInfo} from './SeriesInfo';
import {Source} from './Source';

export class Series extends SeriesInfo {
  constructor(source?: Series) {
    super(source);
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.media = source?.media ?? [];
    this.episodes = source?.episodes ?? [];
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Episode)
  @swg.ApiProperty({type: [Episode]})
  readonly episodes: Array<Episode>;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Source)
  @swg.ApiProperty({type: [Source]})
  readonly media: Array<Source>;
}
