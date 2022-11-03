import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';
import {Media} from './Media';

export class MediaEntry {
  constructor(source?: MediaEntry) {
    this.id = source?.id ?? '';
    this.name = source?.name ?? '';
  }

  static from(source: Media) {
    const id = source.id;
    const match = source.path.match(/[^\\/]+$/);
    const name = match ? match[0] : '';
    return new MediaEntry({id, name});
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly name: string;
}
