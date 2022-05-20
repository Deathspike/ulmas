import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '.';
import * as swg from '@nestjs/swagger';

export class Media {
  constructor(source?: Media) {
    this.images = source?.images ?? [];
    this.subtitles = source?.subtitles ?? [];
    this.videos = source?.videos ?? [];
  }

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => mod.MediaFile)
  @swg.ApiProperty({type: [mod.MediaFile]})
  readonly images: Array<mod.MediaFile>;
    
  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => mod.MediaFile)
  @swg.ApiProperty({type: [mod.MediaFile]})
  readonly subtitles: Array<mod.MediaFile>;
    
  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => mod.MediaFile)
  @swg.ApiProperty({type: [mod.MediaFile]})
  readonly videos: Array<mod.MediaFile>;
}
