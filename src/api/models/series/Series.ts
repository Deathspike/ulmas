import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '..';
import * as swg from '@nestjs/swagger';

export class Series {
  constructor(source?: Series, sourcePatch?: Partial<Series>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.seasons = api.property('seasons', source, sourcePatch, []);
    this.synopsis = api.property('synopsis', source, sourcePatch, '');
    this.title = api.property('title', source, sourcePatch, '');
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => mod.SeriesSeason)
  @swg.ApiProperty({type: [mod.SeriesSeason]})
  readonly seasons: Array<mod.SeriesSeason>;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly synopsis?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
