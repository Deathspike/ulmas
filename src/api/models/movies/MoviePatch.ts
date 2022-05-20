import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaResume} from '../MediaResume';

export class MoviePatch {
  constructor(source?: MoviePatch) {
    this.resume = source?.resume;
    this.watched = source?.watched;
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
