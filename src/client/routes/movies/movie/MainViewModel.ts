import * as api from 'api'
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
    const movies = await core.api.movies.itemAsync(this.sectionId, this.movieId);
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
      ? core.api.movies.mediaUrl(this.sectionId, this.movieId, image.id)
      : undefined;
  }

  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: api.models.Movie;
}
