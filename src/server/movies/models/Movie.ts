import * as clv from 'class-validator';
import {MovieXml} from './MovieXml';
import fs from 'fs';

export class Movie {
  constructor(movieXml: MovieXml) {
    this.plot = movieXml.plot;
    this.title = movieXml.title;
  }

  static async loadAsync(filePath: string) {
    const movieXml = await fs.promises.readFile(filePath, 'utf8').then(MovieXml.parseAsync);
    const movie = new Movie(movieXml);
    await clv.validateOrReject(movie);
    return movie;
  }

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly plot?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly title: string;
}
