import * as api from 'api';
import {core} from '..';

export class ImageService {
  episode(series: api.models.Series | api.models.SeriesEntry, episode: api.models.Episode, ...names: Array<string>) {
    const expressions = names.map(x => new RegExp(`-${x}\.[^\\.]+$`, 'i'));
    const match = expressions.map(x => episode.media.images?.find(y => x.test(y.path))).find(Boolean);
    return match ? core.api.series.mediaUrl(core.route.get('sectionId'), series.id, match.id) : undefined;
  }

  movie(movie: api.models.Movie | api.models.MovieEntry, ...names: Array<string>) {
    const expressions = names.map(x => new RegExp(`[\\\\/-]${x}\.[^\\.]+$`, 'i'));
    const images = isMovie(movie) ? movie.media.images : movie.images;
    const match = expressions.map(x => images?.find(y => x.test(y.path))).find(Boolean);
    return match ? core.api.movies.mediaUrl(core.route.get('sectionId'), movie.id, match.id) : undefined;
  }

  series(series: api.models.Series | api.models.SeriesEntry, ...names: Array<string>) {
    const expressions = names.map(x => new RegExp(`[\\\\/]${x}\.[^\\.]+$`, 'i'));
    const match = expressions.map(x => series.images?.find(y => x.test(y.path))).find(Boolean);
    return match ? core.api.series.mediaUrl(core.route.get('sectionId'), series.id, match.id) : undefined;
  }
}

function isMovie(movie: api.models.Movie | api.models.MovieEntry): movie is api.models.Movie {
  return movie.hasOwnProperty('media');
}
