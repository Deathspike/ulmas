import * as app from '..';
import * as nst from '@nestjs/common';
import {MovieCache} from './cache/MovieCache';
import {SectionCache} from './cache/SectionCache';
import {StreamCache} from './cache/StreamCache';
import {MovieInfo} from './models/MovieInfo';
import {StreamMap} from './models/StreamMap';
import path from 'path';
const logger = new nst.Logger('Movies');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService) {}

  async checkAsync(sectionId: string, rootPaths: Array<string>) {
    const purgeAsync = this.cacheService.createPurgeable(`movies.${sectionId}`);
    const result: Array<app.api.models.MovieListItem> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      for await (const {movie, streamMap} of this.rebuildAsync(rootPath)) {
        await new MovieCache(sectionId, movie.id).saveAsync(movie);
        await new StreamCache(sectionId, movie.id).saveAsync(streamMap);
        result.push(new app.api.models.MovieListItem({...movie, images: movie.media.images}));
      }
    }));
    await new SectionCache(sectionId).saveAsync(result);
    await purgeAsync();
  }

  private async *rebuildAsync(rootPath: string) {
    const context = await this.contextService.contextAsync(rootPath);
    for (const {fullPath} of Object.values(context.info)) {
      const streamMap = new StreamMap();
      const movie = await this
        .rebuildMovieAsync(context, fullPath, streamMap)
        .catch(() => logger.error(`Invalid movie: ${fullPath}`));
      if (movie) yield {movie, streamMap};
    }
  }

  private async rebuildMovieAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, moviePath: string, streamMap: StreamMap) {
    const {name} = path.parse(moviePath);
    const movieInfo = await MovieInfo
      .loadAsync(moviePath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([x, y]) => streamMap.add(y.mtimeMs, x, y.fullPath));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([x, y]) => streamMap.add(y.mtimeMs, x, y.fullPath));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([x, y]) => streamMap.add(y.mtimeMs, x, y.fullPath));
    return new app.api.models.Movie({
      ...movieInfo,
      id: app.id(moviePath),
      media: new app.api.models.Media({images, subtitles, videos})
    });
  }
}
