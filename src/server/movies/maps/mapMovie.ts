import * as app from '../..';
import {Movie} from '../models/Movie';
import {mapSource} from './mapSource';

export function mapMovie(movie: Movie) {
  return new app.api.models.Movie({
    id: movie.id,
    media: movie.media.map(mapSource),
    plot: movie.plot,
    title: movie.title
  });
}
