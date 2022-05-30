import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly movieId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const movie = await core.api.movies.itemAsync(this.sectionId, this.movieId);
    if (movie.value) {
      this.movie = movie.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.observable
  movie?: api.models.Movie;
}
