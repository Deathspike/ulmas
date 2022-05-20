import * as app from '../..';
import {Movie} from '../models/Movie';
import {mapMedia} from './mapMedia';

export function mapMovieListItem(value: Movie) {
  const images = mapMedia(value.sources).images;
  return new app.api.models.MovieListItem({...value, images});
}
