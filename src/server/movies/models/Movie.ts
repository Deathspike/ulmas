import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as swg from '@nestjs/swagger';
import {MovieInfo} from './MovieInfo';
import {Source} from './Source';

export class Movie extends MovieInfo {
  constructor(source?: Movie) {
    super(source);
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.media = source?.media ?? [];
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => Source)
  @swg.ApiProperty({type: [Source]})
  readonly media: Array<Source>;
}
