import * as app from '../..';
import {Series} from '../models/Series';
import {mapEpisode} from './mapEpisode';
import {mapMedia} from './mapMedia';

export function mapSeries(value: Series) {
  const id = value.id;
  const episodes = value.episodes.map(mapEpisode);
  const images = mapMedia(value.sources).images;
  const plot = value.plot;
  const title = value.title;
  return new app.api.models.Series({id, episodes, images, plot, title});
}
