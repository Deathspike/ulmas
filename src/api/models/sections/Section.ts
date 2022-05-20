import * as api from '../..';
import * as clv from 'class-validator';
import * as nst from '@nestjs/swagger';

export class Section {
  constructor(source?: Section, sourcePatch?: Partial<Section>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.paths = api.property('paths', source, sourcePatch, []);
    this.title = api.property('title', source, sourcePatch, '');
    this.type = api.property('type', source, sourcePatch, 'series');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly id: string;

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
