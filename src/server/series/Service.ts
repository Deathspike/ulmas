import * as app from '..';
import * as nst from '@nestjs/common';
import {Episode} from './models/Episode';
import {Series} from './models/Series';
import path from 'path';
const logger = new nst.Logger('Series');

@nst.Injectable()
export class Service {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly contextService: app.core.ContextService) {}

  async listAsync(rootPaths: Array<string>, forceUpdate = false) {
    const seriesPaths = await app.sequenceAsync(
      rootPaths,
      x => this.fetchAsync(x, forceUpdate));
    const series = await app.sequenceAsync(
      seriesPaths.flatMap(x => x),
      x => this.loadSeriesAsync(x, false));
    series.sort((a, b) => a.title.localeCompare(b.title));
    return series;
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
      const seriesInfo = await Series
        .loadAsync(seriesPath);
      const images = Object.entries(context.images)
        .filter(([x]) => !/-[a-z]+\./i.test(x))
        .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'image'})));
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
      return new app.api.models.Series(app.create(seriesPath, {
        ...seriesInfo,
        episodes: episodes,
        media: images
      }));
    });
  }
  
  private async loadEpisodeAsync(context: app.core.Context, episodePath: string) {
    const {name} = path.parse(episodePath);
    const episodeInfo = await Episode
      .loadAsync(episodePath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'image'})));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'subtitle'})));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'video'})));
    return new app.api.models.Episode(app.create(episodePath, {
      ...episodeInfo,
      media: images.concat(subtitles, videos)
    }));
  }
}

function ensure<T>(items: Array<T | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}
