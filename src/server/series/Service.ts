import * as app from '..';
import * as nst from '@nestjs/common';
import {Episode} from './models/Episode';
import {EpisodeInfo} from './models/EpisodeInfo';
import {Series} from './models/Series';
import {SeriesInfo} from './models/SeriesInfo';
import {Source} from './models/Source';
import path from 'path';
const logger = new nst.Logger('Series');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService) {}

  async listAsync(rootPaths: Array<string>) {
    const seriesPaths = await app.sequenceAsync(
      rootPaths,
      x => this.fetchAsync(x, false));
    const series = await app.sequenceAsync(
      seriesPaths.flatMap(x => x),
      x => this.loadSeriesAsync(x, false));
    series.sort((a, b) => a.title.localeCompare(b.title));
    return series;
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
    return await this.cacheService.cacheAsync('series', rootPath, forceUpdate, async () => {
      const context = await this.contextService
        .contextAsync(rootPath)
        .catch(() => new app.core.Context());
      const subdirContexts = await app.sequenceAsync(
        Object.values(context.directories),
        x => this.contextService.contextAsync(x));
      const subdirSeries = await app.sequenceAsync(
        subdirContexts.map(x => x.info['tvshow.nfo']).filter(Boolean),
        x => this.loadSeriesAsync(x, forceUpdate).catch(() => logger.warn(`Invalid series: ${x}`)));
      return ensure(subdirSeries).map(x => x.path);
    });
  }

  private async loadSeriesAsync(seriesPath: string, forceUpdate: boolean) {
    const pathData = path.parse(seriesPath);
    return await this.cacheService.cacheAsync('series', seriesPath, forceUpdate, async () => {
      const context = await this.contextService
        .contextAsync(pathData.dir);
      const seriesInfo = await SeriesInfo
        .loadAsync(seriesPath);
      const images = Object.entries(context.images)
        .filter(([x]) => !/-[a-z]+\./i.test(x))
        .map(([_, x]) => new Source(app.create(x, {type: 'image'})));
      const rootEpisodes = await app.sequenceAsync(
        Object.entries(context.info).filter(([x]) => x !== 'tvshow.nfo'),
        ([_, x]) => this.loadEpisodeAsync(context, x).catch(() => logger.warn(`Invalid episode: ${x}`)));
      const subdirContexts = await app.sequenceAsync(
        Object.values(context.directories),
        x => this.contextService.contextAsync(x));
      const subdirEpisodes = await app.sequenceAsync(
        subdirContexts.flatMap(context => Object.values(context.info).map(path => ({context, path}))),
        x => this.loadEpisodeAsync(x.context, x.path).catch(() => logger.warn(`Invalid episode: ${x.path}`)));
      const episodes = ensure(rootEpisodes
        .concat(subdirEpisodes))
        .sort((a, b) => a.season !== b.season ? a.season - b.season : a.episode - b.episode);
      return new Series(app.create(seriesPath, {
        ...seriesInfo,
        episodes: episodes,
        media: images
      }));
    });
  }
  
  private async loadEpisodeAsync(context: app.core.Context, episodePath: string) {
    const {name} = path.parse(episodePath);
    const episodeInfo = await EpisodeInfo
      .loadAsync(episodePath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([_, x]) => new Source(app.create(x, {type: 'image'})));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new Source(app.create(x, {type: 'subtitle'})));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new Source(app.create(x, {type: 'video'})));
    return new Episode(app.create(episodePath, {
      ...episodeInfo,
      media: images.concat(subtitles, videos)
    }));
  }
}

function ensure<T>(items: Array<T | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}
