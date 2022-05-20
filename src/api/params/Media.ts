import * as api from '..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Media {
  constructor(source?: Media, sourcePatch?: Partial<Media>) {
    this.sectionId = api.property('sectionId', source, sourcePatch, '');
    this.resourceId = api.property('resourceId', source, sourcePatch, '');
    this.mediaId = api.property('mediaId', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly resourceId: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly mediaId: string;
}
