import * as app from '../..';
import {Series} from '../models/Series';
import {mapMedia} from './mapMedia';
import {mapSeriesEpisode} from './mapSeriesEpisode';

export function mapSeries(value: Series) {
  const episodes = value.episodes.map(mapSeriesEpisode);
  const images = mapMedia(value.sources).images;
  return new app.api.models.Series({...value, episodes, images});
}
