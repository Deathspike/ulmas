import * as app from '../..';
import {Movie} from '../models/Movie';
import {mapMedia} from './mapMedia';

export function mapItem(value: Movie) {
  const id = value.id;
  const images = mapMedia(value.sources).images;
  const plot = value.plot;
  const title = value.title;
  return new app.api.models.ItemOfMovies({id, images, plot, title});
}
