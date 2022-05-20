import * as app from '../..';
import {Series} from '../models/Series';
import {remapEpisode} from './remapEpisode';
import {remapSources} from './remapSources';

export function remapSeries(value: Series) {
  const episodes = value.episodes.map(remapEpisode);
  const images = remapSources(value.sources).images;
  return new app.api.models.Series({...value, episodes, images});
}
