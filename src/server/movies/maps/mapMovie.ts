import * as app from '../..';
import {Movie} from '../models/Movie';
import {mapMedia} from './mapMedia';

export function mapMovie(value: Movie) {
  const media = mapMedia(value.sources);
  return new app.api.models.Movie({...value, media});
}
