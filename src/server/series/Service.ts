import * as app from '..';
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
  
  async checkAsync(sectionId: string, rootPaths: Array<string>) {
    await this.lockService.lockAsync(sectionId, async () => {
      const purgeAsync = this.cacheService.createPurgeable(`series.${sectionId}`);
      const section: Array<app.api.models.SeriesListItem> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const series of this.buildAsync(rootPath)) {
          await new SeriesCache(sectionId, series.id).saveAsync(series);
          section.push(new app.api.models.SeriesListItem(series));
        }
      }));
      await sectionCache.saveAsync(section);
      await purgeAsync();
    });
  }

  async patchAsync(sectionId: string, seriesId: string, seriesPatch: app.api.bodies.SeriesPatch) {
    return await this.lockService.lockAsync(sectionId, async () => {
      const sectionCache = new SectionCache(sectionId);
      const section = await sectionCache.loadAsync();
      const seriesIndex = section.findIndex(x => x.id === seriesId);
      if (seriesIndex !== -1) {
        const seriesCache = new SeriesCache(sectionId, seriesId);
        const series = await seriesCache.loadAsync();
        const seriesUpdate = this.rebuildSeries(series, seriesPatch);
        section[seriesIndex] = new app.api.models.SeriesListItem(seriesUpdate);
        await Promise.all(series.episodes.map(x => x instanceof app.api.models.Episode && EpisodeInfo.saveAsync(x.path, x)));
        await Promise.all([sectionCache.saveAsync(section), seriesCache.saveAsync(seriesUpdate)]);
        return true;
      } else {
        return false;
      }
    });
  }

  private async *buildAsync(rootPath: string) {
    const context = await this.contextService.contextAsync(rootPath);
    for (const {fullPath} of Object.values(context.directories)) {
      const context = await this.contextService.contextAsync(fullPath);
      const seriesInfo = context.info['tvshow.nfo'];
      if (seriesInfo) {
        const series = await this
          .buildSeriesAsync(context, seriesInfo.fullPath)
          .catch(() => logger.error(`Invalid series: ${seriesInfo.fullPath}`));
        if (series) yield series;
      }
    }
  }

  private async buildSeriesAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, seriesPath: string) {
    const seriesInfo = await SeriesInfo
      .loadAsync(seriesPath);
    const rootEpisodes = await app.sequenceAsync(
      Object.entries(context.info).filter(([x]) => x !== 'tvshow.nfo'),
      ([_, x]) => this.buildEpisodeAsync(context, x.fullPath).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const subdirContexts = await app.sequenceAsync(
      Object.values(context.directories),
      x => this.contextService.contextAsync(x.fullPath));
    const subdirEpisodes = await app.sequenceAsync(
      subdirContexts.flatMap(context => Object.values(context.info).map(({fullPath}) => ({context, fullPath}))),
      x => this.buildEpisodeAsync(x.context, x.fullPath).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const episodes = ensure(rootEpisodes
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
      dateEpisodeAdded: this.refreshEpisodeAdded(episodes),
      lastPlayed: this.refreshLastPlayed(episodes),
      unwatchedCount: this.refreshUnwatchedCount(episodes)
    });
  }
  
  private async buildEpisodeAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, episodePath: string) {
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

  private rebuildSeries(series: app.api.models.Series, seriesPatch: app.api.bodies.SeriesPatch) {
    seriesPatch.episodes
      .map(x => ({i: series.episodes.findIndex(y => y.id === x.id), x}))
      .filter(({i}) => i !== -1)
      .forEach(({x, i}) => series.episodes[i] = this.rebuildEpisode(series.episodes[i], x));
    return new app.api.models.Series({
      ...series,
      dateEpisodeAdded: this.refreshEpisodeAdded(series.episodes),
      lastPlayed: this.refreshLastPlayed(series.episodes),
      unwatchedCount: this.refreshUnwatchedCount(series.episodes)
    });
  }

  private rebuildEpisode(episode: app.api.models.Episode, episodePatch: app.api.bodies.EpisodePatch) {
    const lastPlayed = episodePatch.watched ? DateTime.now().toISO() : episode.lastPlayed;
    const playCount = episodePatch.watched ? (episode.playCount ?? 0) + 1 : episode.playCount;
    return new app.api.models.Episode({...episode, ...episodePatch, lastPlayed, playCount});
  }

  private refreshEpisodeAdded(episodes: Array<app.api.models.Episode>) {
    const datesAdded = ensure(episodes.map(x => x.dateAdded));
    datesAdded.sort((a, b) => b.localeCompare(a));
    return datesAdded.length ? datesAdded[0] : undefined;
  }

  private refreshLastPlayed(episodes: Array<app.api.models.Episode>) {
    const lastPlayed = ensure(episodes.map(x => x.lastPlayed));
    lastPlayed.sort((a, b) => b.localeCompare(a));
    return lastPlayed.length ? lastPlayed[0] : undefined;
  }

  private refreshUnwatchedCount(episodes: Array<app.api.models.Episode>) {
    let unwatchedEpisodes = 0;
    for (const episode of episodes) if (!episode.watched) unwatchedEpisodes++;
    return unwatchedEpisodes;
  }
}

function ensure<T>(items: Array<T | undefined | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}
