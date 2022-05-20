import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as swg from '@nestjs/swagger';
import {SeriesEpisode} from './SeriesEpisode';
import {MediaFile} from '../MediaFile';

export class Series {
  constructor(source?: Series) {
    this.id = source?.id ?? '';
    this.episodes = source?.episodes ?? [];
    this.images = source?.images;
    this.plot = source?.plot;
    this.title = source?.title ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => SeriesEpisode)
  @swg.ApiProperty({type: [SeriesEpisode]})
  readonly episodes: Array<SeriesEpisode>;

  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiPropertyOptional({type: [MediaFile]})
  readonly images?: Array<MediaFile>;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly plot?: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
