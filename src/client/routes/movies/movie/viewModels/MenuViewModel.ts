import * as mobx from 'mobx';
import {core} from 'client/core';

export class MenuViewModel {
  constructor(private readonly sectionId: string, private readonly movieId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async scanAsync() {
    await core.scan.moviesAsync(this.sectionId, this.movieId);
  }

  @mobx.computed
  get isScanning() {
    return core.scan.hasMovies(this.sectionId, this.movieId);
  }
}
