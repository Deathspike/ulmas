import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Media {
  constructor(source?: Media) {
    this.sectionId = source?.sectionId ?? '';
    this.resourceId = source?.resourceId ?? '';
    this.mediaId = source?.mediaId ?? '';
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
