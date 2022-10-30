import * as app from '..';
import * as fun from './functions';
import * as nst from '@nestjs/common';
import {DateTime} from 'luxon';
import {SeriesCache} from './cache/SeriesCache';
import {SectionCache} from './cache/SectionCache';
import {EpisodeInfo} from './models/EpisodeInfo';
import {SeriesInfo} from './models/SeriesInfo';
import fs from 'fs';
import path from 'path';
const logger = new nst.Logger('Series');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService,
    private readonly lockService: app.core.LockService,
    private readonly eventService: app.core.EventService,
    private readonly timeService: app.core.TimeService) {
    this.eventService.addEventListener(x => this.handleEventAsync(x));
  }
  
  async scanRootAsync(sectionId: string, rootPaths: Array<string>) {
    await this.lockService.lockAsync(sectionId, 'series', async () => {
      const purgeAsync = this.cacheService.createPurgeable(`series.${sectionId}`);
      const section: Array<app.api.models.SeriesEntry> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const result of this.inspectRootAsync(rootPath)) {
          const seriesCache = new SeriesCache(sectionId, result.id);
          const seriesPrevious = await seriesCache.loadAsync().catch(() => undefined);
          const series = await this.mergeSeriesAsync(result, seriesPrevious);
          await seriesCache.saveAsync(series);
          section.push(app.api.models.SeriesEntry.from(series));
        }
      }));
      await sectionCache.saveAsync(section);
      await this.eventService.sendAsync('series', sectionId);
      await purgeAsync();
    });
  }

  async scanSeriesAsync(sectionId: string, seriesId: string) {
    return await this.lockService.lockAsync(sectionId, undefined, async () => {
      const sectionCache = new SectionCache(sectionId);
      const section = await sectionCache.loadAsync();
      const seriesIndex = section.findIndex(x => x.id === seriesId);
      if (seriesIndex !== -1) {
        const seriesCache = new SeriesCache(sectionId, seriesId);
        const series = await seriesCache.loadAsync();
        const context = await this.contextService.contextAsync(path.dirname(series.path));
        const seriesInfo = context.info.get('tvshow.nfo');
        if (seriesInfo) {
          const seriesUpdate = await this
            .inspectSeriesAsync(context, seriesInfo)
            .then(x => this.mergeSeriesAsync(x, series))
            .catch(() => logger.error(`Invalid series: ${seriesInfo.fullPath}`));
          if (seriesUpdate) {
            section[seriesIndex] = app.api.models.SeriesEntry.from(seriesUpdate);
            await Promise.all([sectionCache.saveAsync(section), seriesCache.saveAsync(seriesUpdate)]);
            await this.eventService.sendAsync('series', sectionId);
            return true;
          }
        }
      }
      return false;
    });
  }

  async patchAsync(sectionId: string, seriesId: string, seriesPatch: app.api.models.SeriesPatch) {
    const now = DateTime.utc().toISO({suppressMilliseconds: true});
    return await this.lockService.lockAsync(sectionId, undefined, async () => {
      const sectionCache = new SectionCache(sectionId);
      const section = await sectionCache.loadAsync();
      const seriesIndex = section.findIndex(x => x.id === seriesId);
      if (seriesIndex !== -1) {
        const seriesCache = new SeriesCache(sectionId, seriesId);
        const series = await seriesCache.loadAsync();
        const episodeUpdates = Array.from(this.patchSeriesEpisodes(series, seriesPatch, now));
        const seriesUpdate = this.patchSeries(series, episodeUpdates, now);
        section[seriesIndex] = app.api.models.SeriesEntry.from(seriesUpdate);
        await Promise.all(episodeUpdates.map(x => EpisodeInfo.saveAsync(x.path, x)));
        await SeriesInfo.saveAsync(series.path, series);
        await Promise.all([sectionCache.saveAsync(section), seriesCache.saveAsync(seriesUpdate)]);
        await this.eventService.sendAsync('series', sectionId);
        return true;
      } else {
        return false;
      }
    });
  }

  private async handleEventAsync(event: app.api.models.Event) {
    if (event.type !== 'sections') return;
    await this.lockService.lockAsync(event.sectionId, undefined, async () => {
      const purgeAsync = this.cacheService.createPurgeable(`series.${event.sectionId}`);
      await purgeAsync();
    });
  }

  private async *inspectRootAsync(rootPath: string) {
    const context = await this.contextService
      .contextAsync(rootPath);
    const subdirContexts = new app.Linq(context.directories.values())
      .filter(x => !path.basename(x.fullPath).startsWith('.'))
      .map(x => this.contextService.contextAsync(x.fullPath));
    for await (const context of subdirContexts) {
      const seriesInfo = context.info.get('tvshow.nfo');
      if (seriesInfo) {
        const series = await this
          .inspectSeriesAsync(context, seriesInfo)
          .catch(() => logger.error(`Invalid series: ${seriesInfo.fullPath}`));
        if (series) yield series;
      }
    }
  }

  private async inspectSeriesAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, seriesStats: fs.Stats & {fullPath: string}) {
    const seriesInfo = await SeriesInfo
      .loadAsync(seriesStats.fullPath);
    const rootEpisodes = new app.Linq(context.info.entries())
      .filter(([x]) => x !== 'tvshow.nfo')
      .map(([_, x]) => this.inspectEpisodeAsync(context, x).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const subdirEpisodes = new app.Linq(context.directories.values())
      .map(x => this.contextService.contextAsync(x.fullPath))
      .flatMap(context => new app.Linq(context.info.values()).map(x => ({context, ...x})))
      .map(x => this.inspectEpisodeAsync(x.context, x).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const episodes = (await rootEpisodes.concat(subdirEpisodes)
      .toArrayAsync())
      .sort((a, b) => a.season - b.season || a.episode - b.episode);
    const images = await new app.Linq(context.images.entries())
      .filter(([_, x]) => episodes.every(y => !y.media.images?.some(z => z.path === x.fullPath)))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}))
      .toArrayAsync();
    return new app.api.models.Series({
      ...seriesInfo,
      id: app.id(seriesStats.fullPath),
      path: seriesStats.fullPath,
      images, episodes,
      dateEpisodeAdded: fun.fetchEpisodeAdded(episodes),
      totalCount: episodes.length || undefined,
      unwatchedCount: fun.fetchUnwatchedCount(episodes),
      dateAdded: seriesInfo.dateAdded ?? await this.timeService.getAsync(new app.Linq(episodes)
        .map(x => DateTime.fromISO(x.dateAdded))
        .concat(DateTime.fromJSDate(seriesStats.birthtime)))
    });
  }
  
  private async inspectEpisodeAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, episodeStats: fs.Stats & {fullPath: string}) {
    const {name} = path.parse(episodeStats.fullPath);
    const episodeInfo = await EpisodeInfo
      .loadAsync(episodeStats.fullPath);
    const images = await new app.Linq(context.images.entries())
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}))
      .toArrayAsync();
    const subtitles = await new app.Linq(context.subtitles.entries())
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}))
      .toArrayAsync();
    const videos = await new app.Linq(context.videos.entries())
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}))
      .toArrayAsync();
    return new app.api.models.Episode({
      ...episodeInfo,
      id: app.id(episodeStats.fullPath),
      path: episodeStats.fullPath,
      media: new app.api.models.MediaSource({images, subtitles, videos}),
      dateAdded: episodeInfo.dateAdded ?? await this.timeService.getAsync(new app.Linq(context.videos.entries())
        .filter(([x]) => x.startsWith(`${name}.`))
        .map(([_, x]) => DateTime.fromJSDate(x.birthtime))
        .concat(DateTime.fromJSDate(episodeStats.birthtime)))
    });
  }

  private async mergeSeriesAsync(series: app.api.models.Series, previous?: app.api.models.Series) {
    const episodes = await Promise.all(series.episodes.map(x => this.mergeEpisodeAsync(x, previous?.episodes.find(y => x.id == y.id))));
    return new app.api.models.Series({...series, episodes});
  }

  private async mergeEpisodeAsync(episode: app.api.models.Episode, previous?: app.api.models.Episode) {
    if ((typeof episode.lastPlayed === 'undefined' && previous?.lastPlayed)
      || (typeof episode.playCount === 'undefined' && previous?.playCount)
      || (typeof episode.resume === 'undefined' && previous?.resume)
      || (typeof episode.watched === 'undefined' && previous?.watched)) {
      return await EpisodeInfo.saveAsync(episode.path, new app.api.models.Episode({
        ...episode,
        lastPlayed: episode.lastPlayed ?? previous?.lastPlayed,
        playCount: episode.playCount ?? previous?.playCount,
        resume: episode.resume ?? previous?.resume,
        watched: episode.watched ?? previous?.watched
      }));
    } else {
      return episode;
    }
  }

  private patchSeries(series: app.api.models.Series, episodeUpdates: Array<app.api.models.Episode>, now: string) {
    return new app.api.models.Series({
      ...series,
      lastPlayed: episodeUpdates.some(x => x.watched || x.resume) ? now : series.lastPlayed,
      dateEpisodeAdded: fun.fetchEpisodeAdded(series.episodes),
      unwatchedCount: fun.fetchUnwatchedCount(series.episodes)
    });
  }

  private *patchSeriesEpisodes(series: app.api.models.Series, seriesPatch: app.api.models.SeriesPatch, now: string) {
    for (const episode of seriesPatch.episodes) {
      const index = series.episodes.findIndex(y => y.id === episode.id);
      if (index === -1) continue;
      series.episodes[index] = this.patchEpisode(series.episodes[index], episode, now);
      yield series.episodes[index];
    }
  }

  private patchEpisode(episode: app.api.models.Episode, episodePatch: app.api.models.EpisodePatch, now: string) {
    return new app.api.models.Episode({
      ...episode,
      ...episodePatch,
      lastPlayed: episodePatch.watched || episodePatch.resume ? now : episode.lastPlayed,
      playCount: episodePatch.watched ? (episode.playCount ?? 0) + 1 : episode.playCount
    });
  }
}
