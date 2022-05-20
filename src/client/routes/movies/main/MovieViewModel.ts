import * as api from 'api';
import * as mobx from 'mobx';

export class MovieViewModel {
  constructor(
    private readonly movie: api.models.MovieEntry) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.movie.id;
  }

  @mobx.computed
  get title() {
    return this.movie.title;
  }
  
  @mobx.computed
  get url() {
    return encodeURIComponent(this.movie.id);
  }
}
