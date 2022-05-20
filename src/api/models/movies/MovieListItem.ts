import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as swg from '@nestjs/swagger';
import {MediaFile} from '../MediaFile';

export class MovieListItem {
  constructor(source?: MovieListItem) {
    this.id = source?.id ?? '';
    this.images = source?.images;
    this.title = source?.title ?? '';
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
}
