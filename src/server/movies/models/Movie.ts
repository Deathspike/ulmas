import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import {MovieInfo} from './MovieInfo';
import {Source} from './Source';

export class Movie extends MovieInfo {
  constructor(source?: Movie) {
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
