import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {Media} from './Media';

export class MediaSource {
  constructor(source?: MediaSource) {
    this.images = source?.images?.length ? source.images.map(x => new Media(x)) : undefined;
    this.subtitles = source?.subtitles?.length ? source.subtitles.map(x => new Media(x)) : undefined;
    this.videos = source?.videos?.length ? source.videos.map(x => new Media(x)) : undefined;
  }

  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Media)
  @swg.ApiPropertyOptional({type: [Media]})
  readonly images?: Array<Media>;
  
  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Media)
  @swg.ApiPropertyOptional({type: [Media]})
  readonly subtitles?: Array<Media>;

  @clv.IsOptional()
  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Media)
  @swg.ApiPropertyOptional({type: [Media]})
  readonly videos?: Array<Media>;
}
