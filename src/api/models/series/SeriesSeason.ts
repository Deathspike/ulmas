import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '..';
import * as swg from '@nestjs/swagger';

export class SeriesSeason {
  constructor(source?: SeriesSeason, sourcePatch?: Partial<SeriesSeason>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.episodes = api.property('episodes', source, sourcePatch, []);
    this.number = api.property('number', source, sourcePatch, 0);
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
  @clt.Type(() => mod.SeriesSeasonEpisode)
  @swg.ApiProperty({type: [mod.SeriesSeasonEpisode]})
  readonly episodes: Array<mod.SeriesSeasonEpisode>;

  @clv.IsNumber()
  @clv.Min(0)
  @swg.ApiProperty()
  readonly number: number;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
