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
    const image = this.source?.media
      ?.images
      ?.find(x => /[\\/-]poster\.[^\.]+$/i.test(x.path));
    return image
      ? this.apiService.movies.mediaUrl(this.sectionId, this.movieId, image.id)
      : undefined;
  }

  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: api.models.Movie;
}
