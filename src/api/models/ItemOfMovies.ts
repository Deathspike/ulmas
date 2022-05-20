import * as api from '..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class ItemOfMovies {
  constructor(source?: ItemOfMovies, sourcePatch?: Partial<ItemOfMovies>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.synopsis = api.property('synopsis', source, sourcePatch, '');
    this.title = api.property('title', source, sourcePatch, '');
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly synopsis?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
