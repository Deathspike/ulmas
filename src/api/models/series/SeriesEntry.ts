import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaEntry} from '../MediaEntry';
import {Series} from './Series';

export class SeriesEntry {
  constructor(source?: SeriesEntry) {
    this.id = source?.id ?? '';
    this.images = source?.images?.map(x => new MediaEntry(x));
    this.dateEpisodeAdded = source?.dateEpisodeAdded;
    this.lastPlayed = source?.lastPlayed;
    this.totalCount = source?.totalCount;
    this.unwatchedCount = source?.unwatchedCount;
    this.title = source?.title ?? '';
    this.dateAdded = source?.dateAdded ?? '';
  }

  static from(source: Series) {
    const images = source.images?.map(MediaEntry.from);
    return new SeriesEntry({...source, images});
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
  readonly totalCount?: number;

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiPropertyOptional()
  readonly unwatchedCount?: number;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;

  @clv.IsDateString()
  @swg.ApiProperty()
  readonly dateAdded: string;
}
