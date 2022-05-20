import * as api from '../..';
import * as clv from 'class-validator';
import * as nst from '@nestjs/swagger';

export class SectionPart {
  constructor(source?: SectionPart, sourcePatch?: Partial<SectionPart>) {
    this.paths = api.property('paths', source, sourcePatch, []);
    this.title = api.property('title', source, sourcePatch, '');
    this.type = api.property('type', source, sourcePatch, 'series');
  }

  @clv.IsArray()
  @clv.IsString({each: true})
  @clv.IsNotEmpty({each: true})
  @nst.ApiProperty()
  readonly paths: Array<string>;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly title: string;

  @clv.IsString()
  @clv.IsIn(['movies', 'series'])
  @nst.ApiProperty({enum: ['movies', 'series']})
  readonly type: string;
}
