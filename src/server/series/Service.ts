import * as app from '..';
import * as nst from '../../nest';
import {Episode} from './models/Episode';
import {Series} from './models/Series';
import fs from 'fs';
import path from 'path';

// TODO: support episodes not in a season folder
// TODO: createId() should expand to relative path to series (specials-my-episode-name) so season 01/episode 01 and season 02/episode 02 don't get the same id
// TODO: named seasons support
// TODO: get season number from name rather than index (which is arbitrary based on file sort)
// TODO: more detail, like genres, links

@nst.Injectable()
export class Service {
  // [CACHE] When introducing cache, use seriesDetailAsync to prime that cache, too.
  async seriesListAsync(rootPaths: Array<string>) {
    const series: Array<app.api.models.ItemOfSeries> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const seriesNames = await fs.promises.readdir(rootPath).catch(() => []);
      await Promise.all(seriesNames.map(async (seriesName) => {
        const seriesPath = path.join(rootPath, seriesName);
        const seriesInfo = await Series.loadAsync(seriesPath).catch(() => undefined);
        const seriesValue = app.createValue(seriesPath, seriesInfo);
        if (seriesInfo && seriesValue) series.push(new app.api.models.ItemOfSeries(seriesValue));
      }));
    }));
    series.sort((a, b) => a.title.localeCompare(b.title));
    return series;
  }

  async seriesDetailAsync(seriesPath: string) {
    const seasons: Array<app.api.models.SeriesSeason> = [];
    const seriesInfo = await Series.loadAsync(seriesPath);
    const seriesValue = app.createValue(seriesPath, {...seriesInfo, seasons});
    const seasonNames = await fs.promises.readdir(seriesPath).catch(() => []);
    await Promise.all(seasonNames.map(async (seasonName, seasonIndex) => {
      const episodes: Array<app.api.models.SeriesSeasonEpisode> = [];
      const resourcePath = path.join(seriesPath, seasonName);
      const resourceNames = await fs.promises.readdir(resourcePath).catch(() => []);
      await Promise.all(resourceNames.filter(x => /(?<!movie)\.nfo$/i.test(x)).map(async (infoName) => {
        const episodePath = path.join(resourcePath, infoName.substring(0, infoName.length - 4));
        const episodeInfo = await Episode.loadAsync(episodePath).catch(() => undefined);
        const episodeValue = app.createValue(episodePath, episodeInfo);
        if (episodeInfo && episodeValue) episodes.push(new app.api.models.SeriesSeasonEpisode(episodeValue));
      }));
      if (episodes.length) {
        const seasonValue = app.createValue(resourcePath, {episodes, number: seasonIndex + 1, title: seasonName});
        episodes.sort((a, b) => a.number - b.number);
        seasons.push(new app.api.models.SeriesSeason(seasonValue));
      }
    }));
    seasons.sort((a, b) => a.number - b.number);
    return new app.api.models.Series(seriesValue);
  }

  async episodeDetailAsync(episodePath: string) {
    const episodeInfo = await Episode.loadAsync(episodePath);
    const episodeValue = app.createValue(episodePath, episodeInfo);
    return new app.api.models.Episode(episodeValue);
  }
}
