import * as api from '../..';
import * as clv from 'class-validator';
import * as nst from '@nestjs/swagger';

export class Movie {
  constructor(source?: Movie, sourcePatch?: Partial<Movie>) {
    this.sectionId = api.property('sectionId', source, sourcePatch, '');
    this.movieId = api.property('movieId', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly sectionId: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nst.ApiProperty()
  readonly movieId: string;
}
