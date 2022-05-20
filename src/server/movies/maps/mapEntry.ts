import * as app from '../..';
import {Movie} from '../models/Movie';
import {mapSource} from './mapSource';

export function mapEntry(movie: Movie) {
  return new app.api.models.ItemOfMovies({
    id: movie.id,
    media: movie.media.filter(x => x.type === 'image').map(mapSource),
    plot: movie.plot,
    title: movie.title
  });
}
