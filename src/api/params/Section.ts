import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Section {
  constructor(source?: Section) {
    this.sectionId = source?.sectionId ?? '';
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;
}
