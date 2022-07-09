import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {MediaResume} from '../MediaResume';
import {MediaSource} from '../MediaSource';

export class Episode {
  constructor(source?: Episode) {
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.media = new MediaSource(source?.media);
    this.episode = source?.episode ?? NaN;
    this.season = source?.season ?? NaN;
    this.title = source?.title ?? '';
    this.dateAdded = source?.dateAdded ?? '';
    this.lastPlayed = source?.lastPlayed;
    this.playCount = source?.playCount;
    this.plot = source?.plot;
    this.resume = source?.resume && new MediaResume(source?.resume);
    this.watched = source?.watched;
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsObject()
  @clt.Type(() => MediaSource)
  @swg.ApiProperty({type: [MediaSource]})
  readonly media: MediaSource;

  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiProperty()
  readonly episode: number;

  @clv.IsNumber()
  @clv.Min(0)
  @swg.ApiProperty()
  readonly season: number;

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
  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiPropertyOptional()
  readonly playCount?: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly plot?: string;

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
