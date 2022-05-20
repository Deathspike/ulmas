import * as app from '..';
import * as nst from '@nestjs/common';
import {Episode} from './models/Episode';
import {Series} from './models/Series';
import path from 'path';
import readdirp from 'readdirp';
const logger = new nst.Logger('Series');

@nst.Injectable()
export class Service {
  constructor(
    private readonly mediaService: app.media.Service) {}

  // [CACHE] When introducing cache, use seriesDetailAsync to prime that cache, too.
  async seriesListAsync(rootPaths: Array<string>) {
    const series: Array<app.api.models.ItemOfSeries> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const fileStream = readdirp(rootPath, {depth: 1, fileFilter: 'tvshow.nfo'});
      for await (const {fullPath} of fileStream) {
        const seriesInfo = await Series.loadAsync(fullPath).catch(() => undefined);
        const seriesPath = path.dirname(fullPath);
        if (!seriesInfo) logger.warn(`Invalid series: ${fullPath} (NFO)`);
        else series.push(new app.api.models.ItemOfSeries(app.createValue(seriesPath, seriesInfo)));
      }
    }));
    series.sort((a, b) => a.title.localeCompare(b.title));
    return series;
  }

  async seriesDetailAsync(seriesPath: string) {
    const episodes: Array<app.api.models.SeriesEpisode> = [];
    const seriesInfo = await Series.loadAsync(path.join(seriesPath, 'tvshow.nfo'));
    const seriesValue = app.createValue(seriesPath, {...seriesInfo, episodes});
    const fileStream = readdirp(seriesPath, {depth: 1, fileFilter: '!(movie|tvshow).nfo'});
    for await (const {fullPath} of fileStream) {
      const episodeInfo = await Episode.loadAsync(fullPath).catch(() => undefined);
      const episodePath = await this.mediaService.videoAsync(fullPath);
      if (!episodeInfo) logger.warn(`Invalid episode: ${fullPath} (NFO)`);
      else if (!episodePath) logger.warn(`Invalid episode: ${fullPath} (Orphan)`);
      else episodes.push(new app.api.models.SeriesEpisode(app.createValue(episodePath, episodeInfo)));
    }
    episodes.sort((a, b) => a.season !== b.season ? a.season - b.season : a.episode - b.episode);
    return new app.api.models.Series(seriesValue);
  }

  async episodeDetailAsync(episodePath: string) {
    const episodeInfo = await Episode.loadAsync(episodePath.replace(/\..*$/, '.nfo'));
    const episodeValue = app.createValue(episodePath, episodeInfo);
    return new app.api.models.Episode(episodeValue);
  }
}
