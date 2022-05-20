import * as api from '..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Image {
  constructor(source?: Image, sourcePatch?: Partial<Image>) {
    this.imageName = api.property('imageName', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly imageName: string;
}
