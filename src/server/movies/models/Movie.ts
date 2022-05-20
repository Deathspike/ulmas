import * as clv from 'class-validator';
import {MovieXml} from './MovieXml';
import fs from 'fs';

export class Movie {
  constructor(movieXml: MovieXml) {
    this.synopsis = movieXml.synopsis;
    this.title = movieXml.title;
  }

  static async loadAsync(moviePath: string) {
    const movieXml = await fs.promises.readFile(`${moviePath}.nfo`).then(MovieXml.parseAsync);
    const movie = new Movie(movieXml);
    await clv.validateOrReject(movie);
    return movie;
  }

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly synopsis?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly title: string;
}
