import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class SectionUpdate {
  constructor(source?: SectionUpdate) {
    this.paths = source?.paths ?? [];
    this.title = source?.title ?? '';
  }

  @clv.IsArray()
  @clv.IsString({each: true})
  @clv.IsNotEmpty({each: true})
  @clv.ArrayNotEmpty()
  @swg.ApiProperty()
  readonly paths: Array<string>;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
