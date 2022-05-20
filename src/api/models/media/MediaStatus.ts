import * as api from '../..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class MediaStatus {
  constructor(source?: MediaStatus, sourcePatch?: Partial<MediaStatus>) {
    this.position = api.property('position', source, sourcePatch, NaN);
    this.total = api.property('total', source, sourcePatch, NaN);
  }

  @clv.IsNumber()
  @clv.Min(0)
  @swg.ApiProperty()
  readonly position: number;

  @clv.IsNumber()
  @clv.Min(0)
  @swg.ApiProperty()
  readonly total: number;
}
