import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class MediaFile {
  constructor(source?: MediaFile) {
    this.id = source?.id ?? '';
    this.name = source?.name ?? '';
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
