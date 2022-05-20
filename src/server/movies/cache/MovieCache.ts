import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';

export class MovieCache {
  constructor(sectionId: string, movieId: string) {
    this.fullPath = path.join(app.settings.cache, `movies.${sectionId}.${movieId}.json`);
  }

  async loadAsync() {
    const movieJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const movie = new app.api.models.Movie(JSON.parse(movieJson));
    await clv.validateOrReject(movie);
    return movie;
  }

  async saveAsync(movie: app.api.models.Movie) {
    await clv.validateOrReject(movie);
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(`${this.fullPath}.tmp`, JSON.stringify(movie));
    await fs.promises.rename(`${this.fullPath}.tmp`, this.fullPath);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
