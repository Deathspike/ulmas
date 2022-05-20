import * as api from '..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Section {
  constructor(source?: Section, sourcePatch?: Partial<Section>) {
    this.sectionId = api.property('sectionId', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;
}
