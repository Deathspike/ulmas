import * as app from '..';
import * as nst from '@nestjs/common';
import {Movie} from './models/Movie';

@nst.Injectable()
export class Service {
  constructor(
    private readonly mediaService: app.media.Service) {}

  // [CACHE] When introducing cache, use movieDetailAsync to prime that cache, too.
  async movieListAsync(rootPaths: Array<string>) {
    const movies: Array<app.api.models.ItemOfMovies> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const infoPaths = await app.searchAsync(rootPath, '*/!(movie|tvshow).nfo');
      await Promise.all(infoPaths.map(async (infoPath) => {
        const movieInfo = await Movie.loadAsync(infoPath).catch(() => undefined);
        const moviePath = await this.mediaService.videoAsync(infoPath);
        if (movieInfo && moviePath) movies.push(new app.api.models.Movie(app.createValue(moviePath, movieInfo)));
      }));
    }));
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return movies;
  }

  async movieDetailAsync(moviePath: string) {
    const movieInfo = await Movie.loadAsync(moviePath.replace(/\..*$/, '.nfo'));
    const movieValue = app.createValue(moviePath, movieInfo);
    return new app.api.models.Movie(movieValue);
  }
}
