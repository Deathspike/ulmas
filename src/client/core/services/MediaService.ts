import * as api from 'api';
import {ApiService} from './ApiService';
import {RouteService} from './RouteService';
import {Service} from 'typedi';

@Service()
export class MediaService {
  constructor(
    private readonly apiService: ApiService,
    private readonly routeService: RouteService) {}

  movieImageUrl(movie: api.models.Movie | api.models.MovieEntry, name: string) {
    const expression = new RegExp(`[\\\\/-]${name}\.[^\\.]+$`, 'i');
    const images = isMovie(movie) ? movie.media.images : movie.images;
    const match = images?.find(x => expression.test(x.path));
    return match ? this.apiService.movies.mediaUrl(this.routeService.get('sectionId'), movie.id, match.id) : undefined;
  }

  seriesImageUrl(series: api.models.Series | api.models.SeriesEntry, name: string) {
    const expression = new RegExp(`[\\\\/]${name}\.[^\\.]+$`, 'i');
    const match = series.images?.find(x => expression.test(x.path));
    return match ? this.apiService.series.mediaUrl(this.routeService.get('sectionId'), series.id, match.id) : undefined;
  }
}

function isMovie(movie: api.models.Movie | api.models.MovieEntry): movie is api.models.Movie {
  return movie.hasOwnProperty('media');
}
