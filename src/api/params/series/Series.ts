import * as api from '../..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Series {
  constructor(source?: Series, sourcePatch?: Partial<Series>) {
    this.sectionId = api.property('sectionId', source, sourcePatch, '');
    this.seriesId = api.property('seriesId', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly seriesId: string;
}
