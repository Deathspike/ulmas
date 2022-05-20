import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Media {
  constructor(source?: Media) {
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.type = source?.type ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsString()
  @clv.IsIn(['image', 'subtitle', 'video'])
  @swg.ApiProperty({enum: ['image', 'subtitle', 'video']})
  readonly type: string;
}
