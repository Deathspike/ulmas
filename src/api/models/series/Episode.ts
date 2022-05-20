import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '..';
import * as swg from '@nestjs/swagger';

export class Episode {
  constructor(source?: Episode, sourcePatch?: Partial<Episode>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.media = api.property('media', source, sourcePatch, []);
    this.episode = api.property('episode', source, sourcePatch, NaN);
    this.plot = api.property('plot', source, sourcePatch, '');
    this.season = api.property('season', source, sourcePatch, NaN);
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
  @clt.Type(() => mod.Media)
  @swg.ApiProperty({type: [mod.Media]})
  readonly media: Array<mod.Media>;

  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiProperty()
  readonly episode: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly plot?: string;

  @clv.IsNumber()
  @clv.Min(0)
  @swg.ApiProperty()
  readonly season: number;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
