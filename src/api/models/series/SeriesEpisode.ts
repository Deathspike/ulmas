import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as swg from '@nestjs/swagger';
import {Media} from '../Media';

export class SeriesEpisode {
  constructor(source?: SeriesEpisode) {
    this.id = source?.id ?? '';
    this.media = source?.media ?? new Media();
    this.episode = source?.episode ?? NaN;
    this.plot = source?.plot;
    this.season = source?.season ?? NaN;
    this.title = source?.title ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsObject()
  @clt.Type(() => Media)
  @swg.ApiProperty({type: [Media]})
  readonly media: Media;

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
