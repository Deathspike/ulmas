import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as swg from '@nestjs/swagger';
import {MediaFile} from '../MediaFile';

export class SeriesListItem {
  constructor(source?: SeriesListItem) {
    this.id = source?.id ?? '';
    this.images = source?.images ?? [];
    this.plot = source?.plot;
    this.title = source?.title ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiProperty({type: [MediaFile]})
  readonly images: Array<MediaFile>;

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