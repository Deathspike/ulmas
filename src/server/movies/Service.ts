import * as app from '..';
import * as nst from '@nestjs/common';
import {Movie} from './models/Movie';
import {MovieInfo} from './models/MovieInfo';
import {Source} from './models/Source';
import path from 'path';
const logger = new nst.Logger('Movies');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService) {}

  async listAsync(rootPaths: Array<string>) {
    const moviePaths = await app.sequenceAsync(
      rootPaths,
      x => this.fetchAsync(x, false));
    const movies = await app.sequenceAsync(
      moviePaths.flatMap(x => x),
      x => this.loadAsync(x, false));
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return movies;
  }
  
  async refreshAsync(rootPaths: Array<string>) {
    await app.sequenceAsync(rootPaths, async (x) => {
      const startTime = Date.now();
      logger.verbose(`Checking ${x}`);
      await this.fetchAsync(x, true);
      logger.verbose(`Finished ${x} in ${Date.now() - startTime}ms`);
    });
  }

  private async fetchAsync(rootPath: string, forceUpdate: boolean) {
    return await this.cacheService.cacheAsync('movies', rootPath, forceUpdate, async () => {
      const context = await this.contextService
        .contextAsync(rootPath);
      const rootMovies = await app.sequenceAsync(
        Object.entries(context.info).filter(([x]) => x !== 'movie.nfo'),
        ([_, x]) => this.loadAsync(x.fullPath, forceUpdate).catch(() => logger.warn(`Invalid movie: ${x}`)));
      const subdirContexts = await app.sequenceAsync(
        Object.values(context.directories),
        x => this.contextService.contextAsync(x.fullPath));
      const subdirMovies = await app.sequenceAsync(
        subdirContexts.flatMap(x => Object.entries(x.info).filter(([x]) => x !== 'movie.nfo')),
        ([_, x]) => this.loadAsync(x.fullPath, forceUpdate).catch(() => logger.warn(`Invalid movie: ${x}`)));
      return ensure(rootMovies.concat(subdirMovies)).map(x => x.path);
    });
  }

  private async loadAsync(moviePath: string, forceUpdate: boolean) {
    const pathData = path.parse(moviePath);
    return await this.cacheService.cacheAsync('movies', moviePath, forceUpdate, async () => {
      const context = await this.contextService
        .contextAsync(pathData.dir);
      const movieInfo = await MovieInfo
        .loadAsync(moviePath);
      const images = Object.entries(context.images)
        .filter(([x]) => x.startsWith(`${pathData.name}-`))
        .map(([_, x]) => new Source({id: app.id(x.fullPath), path: x.fullPath, mtime: x.mtimeMs, type: 'image'}));
      const subtitles = Object.entries(context.subtitles)
        .filter(([x]) => x.startsWith(`${pathData.name}.`))
        .map(([_, x]) => new Source({id: app.id(x.fullPath), path: x.fullPath, mtime: x.mtimeMs, type: 'subtitle'}));
      const videos = Object.entries(context.videos)
        .filter(([x]) => x.startsWith(`${pathData.name}.`))
        .map(([_, x]) => new Source({id: app.id(x.fullPath), path: x.fullPath, mtime: x.mtimeMs, type: 'video'}));
      return new Movie({
        ...movieInfo,
        id: app.id(moviePath),
        path: moviePath,
        media: images.concat(subtitles, videos)
      });
    });
  }
}

function ensure<T>(items: Array<T | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}
