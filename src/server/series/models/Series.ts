import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import {Episode} from './Episode';
import {SeriesInfo} from './SeriesInfo';
import {Source} from './Source';

export class Series extends SeriesInfo {
  constructor(source?: Series) {
    super(source);
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.episodes = source?.episodes ?? [];
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
  @clt.Type(() => Episode)
  readonly episodes: Array<Episode>;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Source)
  readonly sources: Array<Source>;
}
