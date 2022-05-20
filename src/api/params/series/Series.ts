import * as api from '../..';
import * as clv from 'class-validator';
import * as nst from '@nestjs/swagger';

export class Series {
  constructor(source?: Series, sourcePatch?: Partial<Series>) {
    this.sectionId = api.property('sectionId', source, sourcePatch, '');
    this.seriesId = api.property('seriesId', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly sectionId: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly seriesId: string;
}
