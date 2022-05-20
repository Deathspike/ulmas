import * as api from '../..';
import * as clv from 'class-validator';
import * as nst from '@nestjs/swagger';

export class Episode {
  constructor(source?: Episode, sourcePatch?: Partial<Episode>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.number = api.property('number', source, sourcePatch, 0);
    this.synopsis = api.property('synopsis', source, sourcePatch, '');
    this.title = api.property('title', source, sourcePatch, '');
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly path: string;

  @clv.IsNumber()
  @clv.Min(1)
  @nst.ApiProperty()
  readonly number: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiPropertyOptional()
  readonly synopsis?: string;

  @clv.IsOptional()
  @clv.IsString()
  @nst.ApiPropertyOptional()
  readonly title?: string;
}
