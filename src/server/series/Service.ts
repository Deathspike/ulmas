import * as app from '..';
import * as nst from '@nestjs/common';
import {SeriesCache} from './cache/SeriesCache';
import {StreamCache} from './cache/StreamCache';
import {SectionCache} from './cache/SectionCache';
import {EpisodeInfo} from './models/EpisodeInfo';
import {SeriesInfo} from './models/SeriesInfo';
import {StreamMap} from './models/StreamMap';
import path from 'path';
const logger = new nst.Logger('Series');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService) {}
  
  async checkAsync(sectionId: string, rootPaths: Array<string>) {
    await this.cacheService.forAsync(`series.${sectionId}`, async () => {
      const section: Array<app.api.models.SeriesListItem> = [];
      const sectionCache = new SectionCache(sectionId);
      await Promise.all(rootPaths.map(async (rootPath) => {
        for await (const {series, streamMap} of this.buildAsync(rootPath)) {
          await new SeriesCache(sectionId, series.id).saveAsync(series);
          await new StreamCache(sectionId, series.id).saveAsync(streamMap);
          section.push(new app.api.models.SeriesListItem(series));
        }
      }));
      await sectionCache.saveAsync(section);
    });
  }

  private async *buildAsync(rootPath: string) {
    const context = await this.contextService.contextAsync(rootPath);
    for (const {fullPath} of Object.values(context.directories)) {
      const context = await this.contextService.contextAsync(fullPath);
      const seriesInfo = context.info['tvshow.nfo'];
      const streamMap = new StreamMap();
      if (seriesInfo) {
        const series = await this
          .buildSeriesAsync(context, seriesInfo.fullPath, streamMap)
          .catch(() => logger.error(`Invalid series: ${seriesInfo.fullPath}`));
        if (series) yield {series, streamMap};
      }
    }
  }

  private async buildSeriesAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, seriesPath: string, streamMap: StreamMap) {
    const seriesInfo = await SeriesInfo
      .loadAsync(seriesPath);
    const rootEpisodes = await app.sequenceAsync(
      Object.entries(context.info).filter(([x]) => x !== 'tvshow.nfo'),
      ([_, x]) => this.buildEpisodeAsync(context, x.fullPath, streamMap).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const subdirContexts = await app.sequenceAsync(
      Object.values(context.directories),
      x => this.contextService.contextAsync(x.fullPath));
    const subdirEpisodes = await app.sequenceAsync(
      subdirContexts.flatMap(context => Object.values(context.info).map(({fullPath}) => ({context, fullPath}))),
      x => this.buildEpisodeAsync(x.context, x.fullPath, streamMap).catch(() => logger.warn(`Invalid episode: ${x.fullPath}`)));
    const episodes = ensure(rootEpisodes
      .concat(subdirEpisodes))
      .sort((a, b) => a.season !== b.season ? a.season - b.season : a.episode - b.episode);
    const images = Object.entries(context.images)
      .filter(([_, y]) => !streamMap.has(y.fullPath))
      .map(([x, y]) => streamMap.add(y.mtimeMs, x, y.fullPath));
    return new app.api.models.Series({
      ...seriesInfo,
      id: app.id(seriesPath),
      episodes, images,
      dateEpisodeAdded: this.fetchDateEpisodeAdded(episodes),
      unwatchedCount: this.fetchUnwatchedCount(episodes)
    });
  }
  
  private async buildEpisodeAsync(context: Awaited<ReturnType<app.core.ContextService['contextAsync']>>, episodePath: string, streamMap: StreamMap) {
    const {name} = path.parse(episodePath);
    const episodeInfo = await EpisodeInfo
      .loadAsync(episodePath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([x, y]) => streamMap.add(y.mtimeMs, x, y.fullPath));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([x, y]) => streamMap.add(y.mtimeMs, x, y.fullPath));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([x, y]) => streamMap.add(y.mtimeMs, x, y.fullPath));
    return new app.api.models.SeriesEpisode({
      ...episodeInfo,
      media: new app.api.models.Media({images, subtitles, videos})
    });
  }

  private fetchDateEpisodeAdded(episodes: Array<app.api.models.SeriesEpisode>) {
    const datesAdded = ensure(episodes.map(x => x.dateAdded));
    datesAdded.sort((a, b) => b.localeCompare(a));
    return datesAdded.length ? datesAdded[0] : undefined;
  }

  private fetchUnwatchedCount(episodes: Array<app.api.models.SeriesEpisode>) {
    const unwatchedEpisodes = episodes.filter(x => !x.watched);
    return unwatchedEpisodes.length || undefined;
  }
}

function ensure<T>(items: Array<T | undefined | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}
