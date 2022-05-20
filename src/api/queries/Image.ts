import * as api from '..';
import * as clv from 'class-validator';
import * as nst from '@nestjs/swagger';

export class Image {
  constructor(source?: Image, sourcePatch?: Partial<Image>) {
    this.imageName = api.property('imageName', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly imageName: string;
}
