import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {Episode} from './Episode';
import {MediaResume} from '../MediaResume';

export class EpisodePatch {
  constructor(source?: EpisodePatch) {
    this.id = source?.id ?? '';
    this.resume = source?.resume && new MediaResume(source?.resume);
    this.watched = source?.watched;
  }

  static create(source: Episode, value: MediaResume | boolean) {
    return value instanceof MediaResume
      ? new EpisodePatch({id: source.id, resume: value})
      : new EpisodePatch({id: source.id, watched: value});
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsOptional()
  @clv.ValidateNested()
  @clt.Type(() => MediaResume)
  @swg.ApiPropertyOptional()
  readonly resume?: MediaResume;

  @clv.IsOptional()
  @clv.IsBoolean()
  @swg.ApiPropertyOptional()
  readonly watched?: boolean;
}
