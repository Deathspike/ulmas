import * as app from '..';
import * as nst from '@nestjs/common';
import {Movie} from './models/Movie';
import readdirp from 'readdirp';
const logger = new nst.Logger('Movies');

@nst.Injectable()
export class Service {
  constructor(
    private readonly mediaService: app.media.Service) {}

  // [CACHE] When introducing cache, use movieDetailAsync to prime that cache, too.
  async movieListAsync(rootPaths: Array<string>) {
    const movies: Array<app.api.models.ItemOfMovies> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const fileStream = readdirp(rootPath, {depth: 1, fileFilter: '!(movie|tvshow).nfo'});
      for await (const {fullPath} of fileStream) {
        const movieInfo = await Movie.loadAsync(fullPath).catch(() => undefined);
        const moviePath = await this.mediaService.videoAsync(fullPath);
        if (!movieInfo) logger.warn(`Invalid movie: ${fullPath} (NFO)`);
        else if (!moviePath) logger.warn(`Invalid movie: ${fullPath} (Orphan)`);
        else movies.push(new app.api.models.Movie(app.createValue(moviePath, movieInfo)));
      }
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
