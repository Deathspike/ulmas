import * as app from '..';
import * as nst from '@nestjs/common';
import {DateTime} from 'luxon';
import {MovieCache} from './cache/MovieCache';
import {SectionCache} from './cache/SectionCache';
import {MovieInfo} from './models/MovieInfo';
import fs from 'fs';
import path from 'path';
const logger = new nst.Logger('Movies');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService,
    private readonly lockService: app.core.LockService) {}

  async inspectAsync(sectionId: string, rootPaths: Array<string>) {
    await this.lockService.lockAsync(sectionId, async () => {
      const purgeAsync = this.cacheService.createPurgeable(`movies.${sectionId}`);
      const section: Array<app.api.models.MovieEntry> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const movie of this.inspectRootAsync(rootPath)) {
          await new MovieCache(sectionId, movie.id).saveAsync(movie);
          section.push(new app.api.models.MovieEntry({...movie, images: movie.media.images}));
        }
      }));
      await sectionCache.saveAsync(section);
      await purgeAsync();
    });
  }

  async patchAsync(sectionId: string, movieId: string, moviePatch: app.api.models.MoviePatch) {
    return await this.lockService.lockAsync(sectionId, async () => {
      const sectionCache = new SectionCache(sectionId);
      const section = await sectionCache.loadAsync();
      const movieIndex = section.findIndex(x => x.id === movieId);
      if (movieIndex !== -1) {
        const movieCache = new MovieCache(sectionId, movieId);
        const movie = await movieCache.loadAsync();
        const movieUpdate = this.patchMovie(movie, moviePatch);
        section[movieIndex] = new app.api.models.MovieEntry({...movieUpdate, images: movie.media.images});
        await MovieInfo.saveAsync(movie.path, movieUpdate);
        await Promise.all([sectionCache.saveAsync(section), movieCache.saveAsync(movieUpdate)]);
        return true;
      } else {
        return false;
      }
    });
  }

  private async *inspectRootAsync(rootPath: string) {
    const context = await this.contextService
      .contextAsync(rootPath);
    const contextMovies = Object.values(context.info)
      .map(x => ({context, ...x}));
    const subdirContexts = await app.sequenceAsync(
      Object.values(context.directories),
      x => this.contextService.contextAsync(x.fullPath));
    const subdirMovies = subdirContexts
      .flatMap(context => Object.values(context.info).map(x => ({context, ...x})));
    for (const movieData of contextMovies.concat(subdirMovies)) {
      const movie = await this
        .inspectMovieAsync(movieData.context, movieData)
        .catch(() => logger.error(`Invalid movie: ${movieData.fullPath}`));
      if (movie) yield movie;
    }
  }

  private async inspectMovieAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, movieStats: fs.Stats & {fullPath: string}) {
    const {name} = path.parse(movieStats.fullPath);
    const movieInfo = await MovieInfo
      .loadAsync(movieStats.fullPath);
    const hasPrivateRoot = Object.values(context.info)
      .every(x => x.fullPath === movieStats.fullPath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`) || hasPrivateRoot)
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    return new app.api.models.Movie({
      ...movieInfo,
      id: app.id(movieStats.fullPath),
      path: movieStats.fullPath,
      media: new app.api.models.Media({images, subtitles, videos}),
      dateAdded: movieInfo.dateAdded ?? DateTime.fromJSDate(movieStats.birthtime).toUTC().toISO()
    });
  }

  private patchMovie(movie: app.api.models.Movie, moviePatch: app.api.models.MoviePatch) {
    return new app.api.models.Movie({
      ...movie,
      ...moviePatch,
      lastPlayed: moviePatch.watched || moviePatch.resume ? DateTime.utc().toISO() : movie.lastPlayed,
      playCount: moviePatch.watched ? (movie.playCount ?? 0) + 1 : movie.playCount
    });
  }
}
