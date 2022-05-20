import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as swg from '@nestjs/swagger';
import {MediaFile} from './MediaFile';

export class Media {
  constructor(source?: Media) {
    this.images = source?.images ?? [];
    this.subtitles = source?.subtitles ?? [];
    this.videos = source?.videos ?? [];
  }

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiProperty({type: [MediaFile]})
  readonly images: Array<MediaFile>;
    
  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiProperty({type: [MediaFile]})
  readonly subtitles: Array<MediaFile>;
    
  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => MediaFile)
  @swg.ApiProperty({type: [MediaFile]})
  readonly videos: Array<MediaFile>;
}
