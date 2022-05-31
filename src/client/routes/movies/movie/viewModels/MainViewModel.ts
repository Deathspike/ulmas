import * as api from 'api';
import * as mobx from 'mobx';
import * as routes from 'client/routes';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string, private readonly movieId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const movie = await core.api.movies.itemAsync(this.sectionId, this.movieId);
    if (movie.value) {
      this.source = movie.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.action
  watch() {
    routes.movies.watch(this.sectionId, this.movieId);
  }

  @mobx.computed
  get posterUrl() {
    return this.source
      ? core.image.movie(this.sectionId, this.source, 'poster')
      : undefined;
  }

  @mobx.observable
  source?: api.models.Movie;
}
