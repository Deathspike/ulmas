import * as api from 'api';
import {ApiService} from './ApiService';
import {RouteService} from './RouteService';
import {Service} from 'typedi';

@Service()
export class MediaService {
  constructor(
    private readonly apiService: ApiService,
    private readonly routeService: RouteService) {}

  movieImageUrl(movie: api.models.Movie | api.models.MovieEntry, names: Array<string>) {
    const expressions = names.map(x => new RegExp(`[\\\\/-]${x}\.[^\\.]+$`, 'i'));
    const images = isMovie(movie) ? movie.media.images : movie.images;
    const match = expressions.map(x => images?.find(y => x.test(y.path))).find(Boolean);
    return match ? this.apiService.movies.mediaUrl(this.routeService.get('sectionId'), movie.id, match.id) : undefined;
  }

  seriesImageUrl(series: api.models.Series | api.models.SeriesEntry, names: Array<string>) {
    const expressions = names.map(x => new RegExp(`[\\\\/]${x}\.[^\\.]+$`, 'i'));
    const match = expressions.map(x => series.images?.find(y => x.test(y.path))).find(Boolean);
    return match ? this.apiService.series.mediaUrl(this.routeService.get('sectionId'), series.id, match.id) : undefined;
  }
}

function isMovie(movie: api.models.Movie | api.models.MovieEntry): movie is api.models.Movie {
  return movie.hasOwnProperty('media');
}
