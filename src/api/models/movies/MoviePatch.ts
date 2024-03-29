import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaResume} from '../MediaResume';

export class MoviePatch {
  constructor(source?: MoviePatch) {
    this.resume = source?.resume && new MediaResume(source?.resume);
    this.watched = source?.watched;
  }

  static create(value: MediaResume | boolean) {
    if (value instanceof MediaResume) {
      return new MoviePatch({resume: value});
    } else {
      return new MoviePatch({watched: value});
    }
  }

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
