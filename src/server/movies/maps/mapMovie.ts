import * as app from '../..';
import {Movie} from '../models/Movie';
import {mapMedia} from './mapMedia';

export function mapMovie(value: Movie) {
  const id = value.id;
  const media = mapMedia(value.sources);
  const plot = value.plot;
  const title = value.title;
  return new app.api.models.Movie({id, media, plot, title});
}
