import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaFile} from '../MediaFile';

export class SeriesListItem {
  constructor(source?: SeriesListItem) {
    this.id = source?.id ?? '';
    this.images = source?.images;
    this.dateEpisodeAdded = source?.dateEpisodeAdded;
    this.lastPlayed = source?.lastPlayed;
    this.unwatchedCount = source?.unwatchedCount;
    this.title = source?.title ?? '';
    this.dateAdded = source?.dateAdded;
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiPropertyOptional({type: [MediaFile]})
  readonly images?: Array<MediaFile>;
  
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
}
