import * as app from '..';
import * as nst from '@nestjs/common';
import {MovieCache} from './cache/MovieCache';
import {SectionCache} from './cache/SectionCache';
import {MovieInfo} from './models/MovieInfo';
import path from 'path';
const logger = new nst.Logger('Movies');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService) {}

  async checkAsync(sectionId: string, rootPaths: Array<string>) {
    await this.cacheService.forAsync(`movies.${sectionId}`, async () => {
      const section: Array<app.api.models.MovieListItem> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const movie of this.buildAsync(rootPath)) {
          await new MovieCache(sectionId, movie.id).saveAsync(movie);
          section.push(new app.api.models.MovieListItem({...movie, images: movie.media.images}));
        }
      }));
      await sectionCache.saveAsync(section);
    });
  }

  private async *buildAsync(rootPath: string) {
    const context = await this.contextService
      .contextAsync(rootPath);
    const contextMovies = Object.values(context.info)
      .map(({fullPath}) => ({context, fullPath}));
    const subdirContexts = await app.sequenceAsync(
      Object.values(context.directories),
      x => this.contextService.contextAsync(x.fullPath));
    const subdirMovies = subdirContexts
      .flatMap(context => Object.values(context.info).map(({fullPath}) => ({context, fullPath})));
    for (const {context, fullPath} of contextMovies.concat(subdirMovies)) {
      const movie = await this
        .buildMovieAsync(context, fullPath)
        .catch(() => logger.error(`Invalid movie: ${fullPath}`));
      if (movie) yield movie;
    }
  }

  private async buildMovieAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, moviePath: string) {
    const {name} = path.parse(moviePath);
    const movieInfo = await MovieInfo
      .loadAsync(moviePath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    return new app.api.models.Movie({
      ...movieInfo,
      id: app.id(moviePath),
      media: new app.api.models.Media({images, subtitles, videos})
    });
  }
}
