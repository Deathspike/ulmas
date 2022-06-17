import * as api from 'api';
import {core} from 'client/core';

export class ImageService {
  episode(sectionId: string, seriesId: string, episode: api.models.Episode, ...names: Array<string>) {
    const expressions = names.map(x => new RegExp(`-${x}\.[^\\.]+$`, 'i'));
    const match = expressions.map(x => episode.media.images?.find(y => x.test(y.path))).find(Boolean);
    return match ? core.api.series.mediaUrl(sectionId, seriesId, match.id) : undefined;
  }

  movie(sectionId: string, movie: api.models.Movie | api.models.MovieEntry, ...names: Array<string>) {
    const expressions = names.map(x => new RegExp(`(^|-)${x}\.[^\\.]+$`, 'i'));
    const images = isMovie(movie) ? movie.media.images?.map(api.models.MediaEntry.from) : movie.images;
    const match = expressions.map(x => images?.find(y => x.test(y.name))).find(Boolean);
    return match ? core.api.movies.mediaUrl(sectionId, movie.id, match.id) : undefined;
  }

  series(sectionId: string, series: api.models.Series | api.models.SeriesEntry, ...names: Array<string>) {
    const expressions = names.map(x => new RegExp(`^${x}\.[^\\.]+$`, 'i'));
    const images = isSeries(series) ? series.images?.map(api.models.MediaEntry.from) : series.images;
    const match = expressions.map(x => images?.find(y => x.test(y.name))).find(Boolean);
    return match ? core.api.series.mediaUrl(sectionId, series.id, match.id) : undefined;
  }
}

function isMovie(movie: api.models.Movie | api.models.MovieEntry): movie is api.models.Movie {
  return movie.hasOwnProperty('media');
}

function isSeries(series: api.models.Series | api.models.SeriesEntry): series is api.models.Series {
  return series.hasOwnProperty('episodes');
}
