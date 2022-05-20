import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaStatus} from '../../models/MediaStatus';

export class MoviePatch {
  constructor(source?: MoviePatch) {
    this.resume = source?.resume;
    this.watched = source?.watched;
  }
  
  @clv.IsOptional()
  @clv.ValidateNested()
  @clt.Type(() => MediaStatus)
  @swg.ApiPropertyOptional()
  readonly resume?: MediaStatus;

  @clv.IsOptional()
  @clv.IsBoolean()
  @swg.ApiPropertyOptional()
  readonly watched?: boolean;
}
