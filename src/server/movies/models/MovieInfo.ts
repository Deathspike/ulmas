import * as clv from 'class-validator';
import {MovieInfoXml} from './MovieInfoXml';
import fs from 'fs';

export class MovieInfo {
  constructor(movieXml?: MovieInfo) {
    this.plot = movieXml?.plot;
    this.title = movieXml?.title ?? '';
  }

  static async loadAsync(fullPath: string) {
    const movieXml = await fs.promises.readFile(fullPath, 'utf-8').then(MovieInfoXml.parseAsync);
    const movie = new MovieInfo(movieXml);
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
