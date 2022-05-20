import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {Episode} from './Episode';
import {MediaFile} from '../MediaFile';

export class Series {
  constructor(source?: Series) {
    this.id = source?.id ?? '';
    this.episodes = source?.episodes ?? [];
    this.images = source?.images;
    this.title = source?.title ?? '';
    this.dateAdded = source?.dateAdded;
    this.dateEpisodeAdded = source?.dateEpisodeAdded;
    this.lastPlayed = source?.lastPlayed;
    this.plot = source?.plot;
    this.unwatchedCount = source?.unwatchedCount;
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Episode)
  @swg.ApiProperty({type: [Episode]})
  readonly episodes: Array<Episode>;

  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiPropertyOptional({type: [MediaFile]})
  readonly images?: Array<MediaFile>;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;

  @clv.IsOptional()
  @clv.IsDateString()
  @swg.ApiPropertyOptional()
  readonly dateAdded?: string;

  @clv.IsOptional()
  @clv.IsDateString()
  @swg.ApiPropertyOptional()
  readonly dateEpisodeAdded?: string;

  @clv.IsOptional()
  @clv.IsDateString()
  @swg.ApiPropertyOptional()
  readonly lastPlayed?: string;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly plot?: string;

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiPropertyOptional()
  readonly unwatchedCount?: number;
}
