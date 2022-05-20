import * as api from '..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Resource {
  constructor(source?: Resource, sourcePatch?: Partial<Resource>) {
    this.sectionId = api.property('sectionId', source, sourcePatch, '');
    this.resourceId = api.property('resourceId', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly resourceId: string;
}
