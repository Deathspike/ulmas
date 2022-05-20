import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaFile} from '../MediaFile';

export class MovieEntry {
  constructor(source?: MovieEntry) {
    this.id = source?.id ?? '';
    this.images = source?.images;
    this.title = source?.title ?? '';
    this.dateAdded = source?.dateAdded ?? '';
    this.lastPlayed = source?.lastPlayed;
    this.watched = source?.watched;
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
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
  
  @clv.IsDateString()
  @swg.ApiProperty()
  readonly dateAdded: string;
  
  @clv.IsOptional()
  @clv.IsDateString()
  @swg.ApiPropertyOptional()
  readonly lastPlayed?: string;

  @clv.IsOptional()
  @clv.IsBoolean()
  @swg.ApiPropertyOptional()
  readonly watched?: boolean;
}
