import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class MediaResume {
  constructor(source?: MediaResume) {
    this.position = source?.position ?? NaN;
    this.total = source?.total ?? NaN;
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
