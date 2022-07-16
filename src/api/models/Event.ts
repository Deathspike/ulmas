import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Event {
  constructor(source?: Event) {
    this.type = source?.type ?? '';
    this.sectionId = source?.sectionId ?? '';
  }

  @clv.IsString()
  @clv.IsIn(['movies', 'sections', 'series'])
  @swg.ApiProperty({enum: ['movies', 'sections', 'series']})
  readonly type: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;
}
