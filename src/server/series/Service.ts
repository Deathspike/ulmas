import * as app from '..';
import * as nst from '@nestjs/common';
import {Episode} from './models/Episode';
import {Series} from './models/Series';
import path from 'path';

@nst.Injectable()
export class Service {
  constructor(
    private readonly mediaService: app.media.Service) {}

  // [CACHE] When introducing cache, use seriesDetailAsync to prime that cache, too.
  async seriesListAsync(rootPaths: Array<string>) {
    const series: Array<app.api.models.ItemOfSeries> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const infoPaths = await app.searchAsync(rootPath, '*/tvshow.nfo');
      await Promise.all(infoPaths.map(async (infoPath) => {
        const seriesPath = path.dirname(infoPath);
        const seriesInfo = await Series.loadAsync(infoPath).catch(() => undefined);
        if (seriesInfo) series.push(new app.api.models.ItemOfSeries(app.createValue(seriesPath, seriesInfo)));
      }));
    }));
    series.sort((a, b) => a.title.localeCompare(b.title));
    return series;
  }

  async seriesDetailAsync(seriesPath: string) {
    const episodes: Array<app.api.models.SeriesEpisode> = [];
    const seriesInfo = await Series.loadAsync(path.join(seriesPath, 'tvshow.nfo'));
    const seriesValue = app.createValue(seriesPath, {...seriesInfo, episodes});
    const infoPaths = await app.searchAsync(seriesPath, '*/!(movie|tvshow).nfo');
    await Promise.all(infoPaths.map(async (infoPath) => {
      const episodeInfo = await Episode.loadAsync(infoPath).catch(() => undefined);
      const episodePath = await this.mediaService.videoAsync(infoPath);
      if (episodeInfo && episodePath) episodes.push(new app.api.models.SeriesEpisode(app.createValue(episodePath, episodeInfo)));
    }));
    episodes.sort((a, b) => a.season !== b.season ? a.season - b.season : a.episode - b.episode);
    return new app.api.models.Series(seriesValue);
  }

  async episodeDetailAsync(episodePath: string) {
    const episodeInfo = await Episode.loadAsync(episodePath.replace(/\..*$/, '.nfo'));
    const episodeValue = app.createValue(episodePath, episodeInfo);
    return new app.api.models.Episode(episodeValue);
  }
}
