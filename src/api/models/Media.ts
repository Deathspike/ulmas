import * as api from '..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Media {
  constructor(source?: Media, sourcePatch?: Partial<Media>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.type = api.property('type', source, sourcePatch, '');
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
