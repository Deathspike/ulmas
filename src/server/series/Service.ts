import * as app from '..';
import * as nst from '@nestjs/common';
import {Episode} from './models/Episode';
import {Series} from './models/Series';
import path from 'path';
const logger = new nst.Logger('Series.Service');

@nst.Injectable()
export class Service {
  constructor(
    private readonly coreService: app.core.Service) {}

  async listAsync(rootPaths: Array<string>) {
    const result: Array<app.api.models.Series> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const context = await this.coreService
        .contextAsync(rootPath);
      const subdirContexts = await Promise.all(Object
        .values(context.directories)
        .map(x => this.coreService.contextAsync(x)));
      const subdirSeries = await Promise.all(subdirContexts
        .filter(x => x.info['tvshow.nfo'])
        .map(x => this.trySeriesAsync(x, x.info['tvshow.nfo'])));
      result.push(...ensure(subdirSeries));
    }));
    result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }

  async detailAsync(series: app.api.models.Series) {
    const context = await this.coreService
      .contextAsync(path.dirname(series.path));
    const rootEpisodes = await Promise.all(Object
      .entries(context.info)
      .filter(([x]) => x !== 'tvshow.nfo')
      .map(([_, x]) => this.tryEpisodeAsync(context, x)));
    const subdirContexts = await Promise.all(Object
      .values(context.directories)
      .map(x => this.coreService.contextAsync(x)));
    const subdirEpisodes = await Promise.all(subdirContexts.flatMap(context => Object
      .values(context.info)
      .map(x => this.tryEpisodeAsync(context, x))));
    return new app.api.models.Series({
      ...series,
      episodes: ensure(rootEpisodes.concat(subdirEpisodes))
    });
  }
  
  private async trySeriesAsync(context: app.core.Context, seriesPath: string) {
    return await Series.loadAsync(seriesPath)
      .then(x => this.createSeries(context, x, seriesPath))
      .catch(() => logger.warn(`Invalid series: ${seriesPath}`));
  }

  private async tryEpisodeAsync(context: app.core.Context, episodePath: string) {
    return await Episode.loadAsync(episodePath)
      .then(x => this.createEpisode(context, x, episodePath))
      .catch(() => logger.warn(`Invalid episode: ${episodePath}`));
  }

  private createSeries(context: app.core.Context, seriesInfo: Series, seriesPath: string) {
    const images = Object.entries(context.images)
      .filter(([x]) => !/-[a-z]+\./i.test(x))
      .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'image'})));
    return new app.api.models.Series(app.create(seriesPath, {
      ...seriesInfo,
      episodes: [],
      media: images
    }));
  }

  private createEpisode(context: app.core.Context, episodeInfo: Episode, episodePath: string) {
    const {name} = path.parse(episodePath);
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
