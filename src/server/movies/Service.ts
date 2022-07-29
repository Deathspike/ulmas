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
    private readonly lockService: app.core.LockService,
    private readonly eventService: app.core.EventService) {
    this.eventService.addEventListener(x => this.handleEventAsync(x));
  }
  
  async scanRootAsync(sectionId: string, rootPaths: Array<string>) {
    await this.lockService.lockAsync(sectionId, 'movies', async () => {
      const purgeAsync = this.cacheService.createPurgeable(`movies.${sectionId}`);
      const section: Array<app.api.models.MovieEntry> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const result of this.inspectRootAsync(rootPath)) {
          const movieCache = new MovieCache(sectionId, result.id);
          const moviePrevious = await movieCache.loadAsync().catch(() => undefined);
          const movie = await this.mergeAsync(result, moviePrevious);
          await movieCache.saveAsync(movie);
          section.push(app.api.models.MovieEntry.from(movie));
        }
      }));
      await sectionCache.saveAsync(section);
      await this.eventService.sendAsync('movies', sectionId);
      await purgeAsync();
    });
  }
  
  async scanMovieAsync(sectionId: string, movieId: string) {
    return await this.lockService.lockAsync(sectionId, undefined, async () => {
      const sectionCache = new SectionCache(sectionId);
      const section = await sectionCache.loadAsync();
      const movieIndex = section.findIndex(x => x.id === movieId);
      if (movieIndex !== -1) {
        const movieCache = new MovieCache(sectionId, movieId);
        const movie = await movieCache.loadAsync();
        const context = await this.contextService.contextAsync(path.dirname(movie.path));
        const movieInfo = context.info[path.basename(movie.path)];
        if (movieInfo) {
          const movieUpdate = await this
            .inspectMovieAsync(context, movieInfo)
            .then(x => this.mergeAsync(x, movie))
            .catch(() => logger.error(`Invalid movie: ${movieInfo.fullPath}`));
          if (movieUpdate) {
            section[movieIndex] = app.api.models.MovieEntry.from(movieUpdate);
            await Promise.all([sectionCache.saveAsync(section), movieCache.saveAsync(movieUpdate)]);
            await this.eventService.sendAsync('movies', sectionId);
            return true;
          }
        }
      }
      return false;
    });
  }

  async patchAsync(sectionId: string, movieId: string, moviePatch: app.api.models.MoviePatch) {
    const now = DateTime.utc().toISO({suppressMilliseconds: true});
    return await this.lockService.lockAsync(sectionId, undefined, async () => {
      const sectionCache = new SectionCache(sectionId);
      const section = await sectionCache.loadAsync();
      const movieIndex = section.findIndex(x => x.id === movieId);
      if (movieIndex !== -1) {
        const movieCache = new MovieCache(sectionId, movieId);
        const movie = await movieCache.loadAsync();
        const movieUpdate = this.patchMovie(movie, moviePatch, now);
        section[movieIndex] = app.api.models.MovieEntry.from(movieUpdate);
        await MovieInfo.saveAsync(movie.path, movieUpdate);
        await Promise.all([sectionCache.saveAsync(section), movieCache.saveAsync(movieUpdate)]);
        await this.eventService.sendAsync('movies', sectionId);
        return true;
      } else {
        return false;
      }
    });
  }

  private async handleEventAsync(event: app.api.models.Event) {
    if (event.type !== 'sections') return;
    await this.lockService.lockAsync(event.sectionId, undefined, async () => {
      const purgeAsync = this.cacheService.createPurgeable(`movies.${event.sectionId}`);
      await purgeAsync();
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
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    return new app.api.models.Movie({
      ...movieInfo,
      id: app.id(movieStats.fullPath),
      path: movieStats.fullPath,
      media: new app.api.models.MediaSource({images, subtitles, videos}),
      dateAdded: movieInfo.dateAdded ?? DateTime.fromJSDate(movieStats.birthtime).toUTC().toISO({suppressMilliseconds: true})
    });
  }

  private async mergeAsync(movie: app.api.models.Movie, previous?: app.api.models.Movie) {
    if ((typeof movie.lastPlayed === 'undefined' && previous?.lastPlayed)
      || (typeof movie.playCount === 'undefined' && previous?.playCount)
      || (typeof movie.resume === 'undefined' && previous?.resume)
      || (typeof movie.watched === 'undefined' && previous?.watched)) {
      return await MovieInfo.saveAsync(movie.path, new app.api.models.Movie({
        ...movie,
        lastPlayed: movie.lastPlayed ?? previous?.lastPlayed,
        playCount: movie.playCount ?? previous?.playCount,
        resume: movie.resume ?? previous?.resume,
        watched: movie.watched ?? previous?.watched
      }));
    } else {
      return movie;
    }
  }

  private patchMovie(movie: app.api.models.Movie, moviePatch: app.api.models.MoviePatch, now: string) {
    return new app.api.models.Movie({
      ...movie,
      ...moviePatch,
      lastPlayed: moviePatch.watched || moviePatch.resume ? now : movie.lastPlayed,
      playCount: moviePatch.watched ? (movie.playCount ?? 0) + 1 : movie.playCount
    });
  }
}
