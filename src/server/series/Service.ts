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
    private readonly eventService: app.core.EventService) {
    this.eventService.addEventListener(x => this.handleEventAsync(x));
  }
  
  async inspectAsync(sectionId: string, rootPaths: Array<string>) {
    await this.lockService.lockAsync(sectionId, 'series', async () => {
      const purgeAsync = this.cacheService.createPurgeable(`series.${sectionId}`);
      const section: Array<app.api.models.SeriesEntry> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const series of this.inspectRootAsync(rootPath)) {
          await new SeriesCache(sectionId, series.id).saveAsync(series);
          section.push(app.api.models.SeriesEntry.from(series));
        }
      }));
      await sectionCache.saveAsync(section);
      await this.eventService.sendAsync('series', sectionId);
      await purgeAsync();
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
    const purgeAsync = this.cacheService.createPurgeable(`series.${event.sectionId}`);
    await purgeAsync();
  }

  private async *inspectRootAsync(rootPath: string) {
    const context = await this.contextService.contextAsync(rootPath);
    for (const {fullPath} of Object.values(context.directories)) {
      const context = await this.contextService.contextAsync(fullPath);
      const seriesInfo = context.info['tvshow.nfo'];
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
    const rootEpisodes = await app.sequenceAsync(
      Object.entries(context.info).filter(([x]) => x !== 'tvshow.nfo'),
      ([_, x]) => this.inspectEpisodeAsync(context, x).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const subdirContexts = await app.sequenceAsync(
      Object.values(context.directories),
      x => this.contextService.contextAsync(x.fullPath));
    const subdirEpisodes = await app.sequenceAsync(
      subdirContexts.flatMap(context => Object.values(context.info).map(x => ({context, ...x}))),
      x => this.inspectEpisodeAsync(x.context, x).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const episodes = fun.ensure(rootEpisodes
      .concat(subdirEpisodes))
      .sort((a, b) => a.season - b.season || a.episode - b.episode);
    const images = Object.entries(context.images)
      .filter(([_, x]) => episodes.every(y => !y.media.images?.some(z => z.path === x.fullPath)))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    return new app.api.models.Series({
      ...seriesInfo,
      id: app.id(seriesStats.fullPath),
      path: seriesStats.fullPath,
      images, episodes,
      dateEpisodeAdded: fun.fetchEpisodeAdded(episodes),
      totalCount: episodes.length || undefined,
      unwatchedCount: fun.fetchUnwatchedCount(episodes),
      dateAdded: seriesInfo.dateAdded ?? DateTime.fromJSDate(seriesStats.birthtime).toUTC().toISO({suppressMilliseconds: true})
    });
  }
  
  private async inspectEpisodeAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, episodeStats: fs.Stats & {fullPath: string}) {
    const {name} = path.parse(episodeStats.fullPath);
    const episodeInfo = await EpisodeInfo
      .loadAsync(episodeStats.fullPath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    return new app.api.models.Episode({
      ...episodeInfo,
      id: app.id(episodeStats.fullPath),
      path: episodeStats.fullPath,
      media: new app.api.models.MediaSource({images, subtitles, videos}),
      dateAdded: episodeInfo.dateAdded ?? DateTime.fromJSDate(episodeStats.birthtime).toUTC().toISO({suppressMilliseconds: true})
    });
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
    const episodePatches = seriesPatch.episodes
      .map(x => ({i: series.episodes.findIndex(y => y.id === x.id), x}))
      .filter(({i}) => i !== -1);
    for (const {x, i} of episodePatches) {
      series.episodes[i] = this.patchEpisode(series.episodes[i], x, now);
      yield series.episodes[i];
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
