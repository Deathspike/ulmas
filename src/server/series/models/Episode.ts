import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import {EpisodeInfo} from './EpisodeInfo';
import {Source} from './Source';

export class Episode extends EpisodeInfo {
  constructor(source?: Episode) {
    super(source);
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.sources = source?.sources ?? [];
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly path: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Source)
  readonly sources: Array<Source>;
}
