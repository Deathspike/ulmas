import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Section {
  constructor(source?: Section) {
    this.id = source?.id ?? '';
    this.paths = source?.paths ?? [];
    this.title = source?.title ?? '';
    this.type = source?.type ?? '';
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsArray()
  @clv.IsString({each: true})
  @clv.IsNotEmpty({each: true})
  @swg.ApiProperty()
  readonly paths: Array<string>;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
  
  @clv.IsString()
  @clv.IsIn(['movies', 'series'])
  @swg.ApiProperty({enum: ['movies', 'series']})
  readonly type: string;
}
