import * as api from '../..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class SeriesSeasonEpisode {
  constructor(source?: SeriesSeasonEpisode, sourcePatch?: Partial<SeriesSeasonEpisode>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.number = api.property('number', source, sourcePatch, 0);
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

  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiProperty()
  readonly number: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly synopsis?: string;

  @clv.IsOptional()
  @clv.IsString()
  @swg.ApiPropertyOptional()
  readonly title?: string;
}
