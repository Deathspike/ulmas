import * as api from '../..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class MediaRequest {
  constructor(source?: MediaRequest, sourcePatch?: Partial<MediaRequest>) {
    this.position = api.property('position', source, sourcePatch, NaN);
    this.subtitleUrls = api.property('subtitleUrls', source, sourcePatch, []);
    this.videoUrl = api.property('videoUrl', source, sourcePatch, '');
  }
  
  @clv.IsNumber()
  @clv.Min(0)
  @swg.ApiProperty()
  readonly position: number;

  @clv.IsArray()
  @clv.IsUrl({require_protocol: true, require_tld: false}, {each: true})
  @swg.ApiProperty()
  readonly subtitleUrls: Array<string>;
  
  @clv.IsUrl({require_protocol: true, require_tld: false})
  @swg.ApiProperty()
  readonly videoUrl: string;
}
