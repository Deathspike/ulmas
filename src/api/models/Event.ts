import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Event {
  constructor(source?: Event) {
    this.source = source?.source ?? '';
    this.reason = source?.reason ?? '';
    this.sectionId = source?.sectionId ?? '';
    this.resourceId = source?.resourceId;
  }

  @clv.IsString()
  @clv.IsIn(['movies', 'sections', 'series'])
  @swg.ApiProperty({enum: ['movies', 'sections', 'series']})
  readonly source: string;

  @clv.IsString()
  @clv.IsIn(['delete', 'update'])
  @swg.ApiProperty({enum: ['delete', 'update']})
  readonly reason: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly resourceId?: string;
}
