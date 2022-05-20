import * as api from '..';
import * as clv from 'class-validator';
import * as nst from '@nestjs/swagger';

export class ItemOfMovies {
  constructor(source?: ItemOfMovies, sourcePatch?: Partial<ItemOfMovies>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.synopsis = api.property('synopsis', source, sourcePatch, '');
    this.title = api.property('title', source, sourcePatch, '');
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly path: string;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiPropertyOptional()
  readonly synopsis?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly title: string;
}
