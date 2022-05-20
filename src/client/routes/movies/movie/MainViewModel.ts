import * as api from 'api'
import * as core from 'client/core';
import * as mobx from 'mobx';
import {Service} from 'typedi';

@Service({transient: true})
export class MainViewModel {
  private readonly sectionId = this.routeService.get('sectionId');
  private readonly movieId = this.routeService.get('movieId');

  constructor(
    private readonly apiService: core.ApiService,
    private readonly mediaService: core.MediaService,
    private readonly routeService: core.RouteService) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const movies = await this.apiService.movies.itemAsync(this.sectionId, this.movieId);
    if (movies.value) {
      this.source = movies.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get posterUrl() {
    return this.source
      ? this.mediaService.movieImageUrl(this.source, 'poster')
      : undefined;
  }

  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: api.models.Movie;
}
