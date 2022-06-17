import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaEntry} from '../MediaEntry';
import {MediaResume} from '../MediaResume';
import {Movie} from './Movie';

export class MovieEntry {
  constructor(source?: MovieEntry) {
    this.id = source?.id ?? '';
    this.images = source?.images;
    this.title = source?.title ?? '';
    this.dateAdded = source?.dateAdded ?? '';
    this.lastPlayed = source?.lastPlayed;
    this.resume = source?.resume;
    this.watched = source?.watched;
  }

  static from(source: Movie) {
    const images = source.media.images?.map(MediaEntry.from);
    return new MovieEntry({...source, images});
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaEntry)
  @swg.ApiPropertyOptional({type: [MediaEntry]})
  readonly images?: Array<MediaEntry>;
  
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
  @clv.ValidateNested()
  @clt.Type(() => MediaResume)
  @swg.ApiPropertyOptional()
  readonly resume?: MediaResume;

  @clv.IsOptional()
  @clv.IsBoolean()
  @swg.ApiPropertyOptional()
  readonly watched?: boolean;
}
