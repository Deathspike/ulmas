import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {Episode} from './Episode';
import {MediaFile} from '../MediaFile';

export class Series {
  constructor(source?: Series) {
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.images = source?.images;
    this.episodes = source?.episodes ?? [];
    this.dateEpisodeAdded = source?.dateEpisodeAdded;
    this.lastPlayed = source?.lastPlayed;
    this.unwatchedCount = source?.unwatchedCount;
    this.title = source?.title ?? '';
    this.dateAdded = source?.dateAdded;
    this.plot = source?.plot;
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiPropertyOptional({type: [MediaFile]})
  readonly images?: Array<MediaFile>;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Episode)
  @swg.ApiProperty({type: [Episode]})
  readonly episodes: Array<Episode>;

  @clv.IsOptional()
  @clv.IsDateString()
  @swg.ApiPropertyOptional()
  readonly dateEpisodeAdded?: string;

  @clv.IsOptional()
  @clv.IsDateString()
  @swg.ApiPropertyOptional()
  readonly lastPlayed?: string;

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiPropertyOptional()
  readonly unwatchedCount?: number;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;

  @clv.IsOptional()
  @clv.IsDateString()
  @swg.ApiPropertyOptional()
  readonly dateAdded?: string;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly plot?: string;
}
