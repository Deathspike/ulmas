import * as app from '../..';
import {Series} from '../models/Series';
import {mapEpisode} from './mapEpisode';
import {mapSource} from './mapSource';

export function mapSeries(series: Series) {
  return new app.api.models.Series({
    id: series.id,
    episodes: series.episodes.map(mapEpisode),
    media: series.media.map(mapSource),
    plot: series.plot,
    title: series.title
  });
}
