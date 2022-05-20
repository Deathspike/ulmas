import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '..';
import * as nst from '@nestjs/swagger';

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
  @nst.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly path: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => mod.SeriesSeasonEpisode)
  @nst.ApiProperty({type: [mod.SeriesSeasonEpisode]})
  readonly episodes: Array<mod.SeriesSeasonEpisode>;

  @clv.IsNumber()
  @clv.Min(0)
  @nst.ApiProperty()
  readonly number: number;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly title: string;
}
