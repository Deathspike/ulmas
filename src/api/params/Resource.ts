import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Resource {
  constructor(source?: Resource) {
    this.sectionId = source?.sectionId ?? '';
    this.resourceId = source?.resourceId ?? '';
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
