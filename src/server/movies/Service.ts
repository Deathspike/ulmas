import * as app from '..';
import * as nst from '@nestjs/common';
import {Movie} from './models/Movie';
import path from 'path';
const logger = new nst.Logger('Movies');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService) {}

  async listAsync(rootPaths: Array<string>, forceUpdate = false) {
    const moviePaths = await app.sequenceAsync(
      rootPaths,
      x => this.fetchAsync(x, forceUpdate));
    const movies = await app.sequenceAsync(
      moviePaths.flatMap(x => x),
      x => this.loadAsync(x, false));
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return movies;
  }

  private async fetchAsync(rootPath: string, forceUpdate: boolean) {
    return await this.cacheService.cacheAsync('movies', rootPath, forceUpdate, async () => {
      const context = await this.contextService
        .contextAsync(rootPath)
        .catch(() => new app.core.Context());
      const rootMovies = await app.sequenceAsync(
        Object.entries(context.info).filter(([x]) => x !== 'movie.nfo'),
        ([_, x]) => this.loadAsync(x, forceUpdate).catch(() => logger.warn(`Invalid movie: ${x}`)));
      const subdirContexts = await app.sequenceAsync(
        Object.values(context.directories),
        x => this.contextService.contextAsync(x));
      const subdirMovies = await app.sequenceAsync(
        subdirContexts.flatMap(x => Object.entries(x.info).filter(([x]) => x !== 'movie.nfo')),
        ([_, x]) => this.loadAsync(x, forceUpdate).catch(() => logger.warn(`Invalid movie: ${x}`)));
      return ensure(rootMovies.concat(subdirMovies)).map(x => x.path);
    });
  }

  private async loadAsync(moviePath: string, forceUpdate: boolean) {
    const pathData = path.parse(moviePath);
    return await this.cacheService.cacheAsync('movies', moviePath, forceUpdate, async () => {
      const context = await this.contextService
        .contextAsync(pathData.dir);
      const movieInfo = await Movie
        .loadAsync(moviePath);
      const images = Object.entries(context.images)
        .filter(([x]) => x.startsWith(`${pathData.name}-`))
        .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'image'})));
      const subtitles = Object.entries(context.subtitles)
        .filter(([x]) => x.startsWith(`${pathData.name}.`))
        .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'subtitle'})));
      const videos = Object.entries(context.videos)
        .filter(([x]) => x.startsWith(`${pathData.name}.`))
        .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'video'})));
      return new app.api.models.Movie(app.create(moviePath, {
        ...movieInfo,
        media: images.concat(subtitles, videos),
      }));
    });
  }
}

function ensure<T>(items: Array<T | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}
