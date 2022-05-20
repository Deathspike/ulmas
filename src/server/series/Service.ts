import * as app from '..';
import * as fun from './utilities';
import * as nst from '@nestjs/common';
import {DateTime} from 'luxon';
import {SeriesCache} from './cache/SeriesCache';
import {SectionCache} from './cache/SectionCache';
import {EpisodeInfo} from './models/EpisodeInfo';
import {SeriesInfo} from './models/SeriesInfo';
import path from 'path';
const logger = new nst.Logger('Series');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService,
    private readonly lockService: app.core.LockService) {}
  
  async inspectAsync(sectionId: string, rootPaths: Array<string>) {
    await this.lockService.lockAsync(sectionId, async () => {
      const purgeAsync = this.cacheService.createPurgeable(`series.${sectionId}`);
      const section: Array<app.api.models.SeriesEntry> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const series of this.inspectRootAsync(rootPath)) {
          await new SeriesCache(sectionId, series.id).saveAsync(series);
          section.push(new app.api.models.SeriesEntry(series));
        }
      }));
      await sectionCache.saveAsync(section);
      await purgeAsync();
    });
  }

  async patchAsync(sectionId: string, seriesId: string, seriesPatch: app.api.models.SeriesPatch) {
    return await this.lockService.lockAsync(sectionId, async () => {
      const sectionCache = new SectionCache(sectionId);
      const section = await sectionCache.loadAsync();
      const seriesIndex = section.findIndex(x => x.id === seriesId);
      if (seriesIndex !== -1) {
        const seriesCache = new SeriesCache(sectionId, seriesId);
        const series = await seriesCache.loadAsync();
        const seriesUpdate = this.patchSeries(series, seriesPatch);
        section[seriesIndex] = new app.api.models.SeriesEntry(seriesUpdate);
        await Promise.all(series.episodes.map(x => x instanceof app.api.models.Episode && EpisodeInfo.saveAsync(x.path, x)));
        await Promise.all([sectionCache.saveAsync(section), seriesCache.saveAsync(seriesUpdate)]);
        return true;
      } else {
        return false;
      }
    });
  }

  private async *inspectRootAsync(rootPath: string) {
    const context = await this.contextService.contextAsync(rootPath);
    for (const {fullPath} of Object.values(context.directories)) {
      const context = await this.contextService.contextAsync(fullPath);
      const seriesInfo = context.info['tvshow.nfo'];
      if (seriesInfo) {
        const series = await this
          .inspectSeriesAsync(context, seriesInfo.fullPath)
          .catch(() => logger.error(`Invalid series: ${seriesInfo.fullPath}`));
        if (series) yield series;
      }
    }
  }

  private async inspectSeriesAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, seriesPath: string) {
    const seriesInfo = await SeriesInfo
      .loadAsync(seriesPath);
    const rootEpisodes = await app.sequenceAsync(
      Object.entries(context.info).filter(([x]) => x !== 'tvshow.nfo'),
      ([_, x]) => this.inspectEpisodeAsync(context, x.fullPath).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const subdirContexts = await app.sequenceAsync(
      Object.values(context.directories),
      x => this.contextService.contextAsync(x.fullPath));
    const subdirEpisodes = await app.sequenceAsync(
      subdirContexts.flatMap(context => Object.values(context.info).map(({fullPath}) => ({context, fullPath}))),
      x => this.inspectEpisodeAsync(x.context, x.fullPath).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const episodes = fun.ensure(rootEpisodes
      .concat(subdirEpisodes))
      .sort((a, b) => a.season !== b.season ? a.season - b.season : a.episode - b.episode);
    const images = Object.entries(context.images)
      .filter(([_, x]) => episodes.every(y => !y.media.images?.some(z => z.path === x.fullPath)))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    return new app.api.models.Series({
      ...seriesInfo,
      id: app.id(seriesPath),
      path: seriesPath,
      images, episodes,
      dateEpisodeAdded: fun.fetchEpisodeAdded(episodes),
      lastPlayed: fun.fetchLastPlayed(episodes),
      unwatchedCount: fun.fetchUnwatchedCount(episodes)
    });
  }
  
  private async inspectEpisodeAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, episodePath: string) {
    const {name} = path.parse(episodePath);
    const episodeInfo = await EpisodeInfo
      .loadAsync(episodePath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.MediaFile({id: app.id(`${x.fullPath}/${x.mtimeMs}`), path: x.fullPath}));
    return new app.api.models.Episode({
      ...episodeInfo,
      id: app.id(episodePath),
      path: episodePath,
      media: new app.api.models.Media({images, subtitles, videos})
    });
  }

  private patchSeries(series: app.api.models.Series, seriesPatch: app.api.models.SeriesPatch) {
    seriesPatch.episodes
      .map(x => ({i: series.episodes.findIndex(y => y.id === x.id), x}))
      .filter(({i}) => i !== -1)
      .forEach(({x, i}) => series.episodes[i] = this.patchEpisode(series.episodes[i], x));
    return new app.api.models.Series({
      ...series,
      dateEpisodeAdded: fun.fetchEpisodeAdded(series.episodes),
      lastPlayed: fun.fetchLastPlayed(series.episodes),
      unwatchedCount: fun.fetchUnwatchedCount(series.episodes)
    });
  }

  private patchEpisode(episode: app.api.models.Episode, episodePatch: app.api.models.EpisodePatch) {
    return new app.api.models.Episode({
      ...episode,
      ...episodePatch,
      lastPlayed: episodePatch.watched ? DateTime.now().toISO() : episode.lastPlayed,
      playCount: episodePatch.watched ? (episode.playCount ?? 0) + 1 : episode.playCount
    });
  }
}
