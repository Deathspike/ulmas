import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Media {
  constructor(source?: Media) {
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;
}
