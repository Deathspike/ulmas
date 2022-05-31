import * as api from 'api';
import * as mobx from 'mobx';
import * as routes from 'client/routes';
import {core} from 'client/core';

export class MovieViewModel {
  constructor(private readonly sectionId: string, source: api.models.MovieEntry) {
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.action
  open() {
    routes.movies.movie(this.sectionId, this.source.id);
  }

  @mobx.computed
  get posterUrl() {
    return core.image.movie(this.sectionId, this.source, 'poster');
  }

  @mobx.observable
  source: api.models.MovieEntry;
}
