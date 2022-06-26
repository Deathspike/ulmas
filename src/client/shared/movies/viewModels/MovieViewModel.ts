import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';
import {core} from 'client/core';

export class MovieViewModel {
  constructor(private readonly controller: app.IController, private readonly sectionId: string, source: api.models.MovieEntry) {
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (this.controller.currentPlayer?.isActive) {
      return false;
    } else if (keyName === 'enter') {
      this.open();
      return true;
    } else if (keyName === 'space') {
      this.playAsync();
      return true;
    } else {
      return false;
    }
  }

  @mobx.action
  open() {
    const viewState = this.controller.viewState;
    routes.movies.movie(this.sectionId, this.source.id, viewState);
  }

  @mobx.action
  async playAsync() {
    await core.screen
      .waitAsync(() => core.api.movies.itemAsync(this.sectionId, this.source.id))
      .then(x => x.value && this.controller.playAsync(x.value));
  }

  @mobx.computed
  get posterUrl() {
    return core.image.movie(this.sectionId, this.source, 'poster');
  }

  @mobx.computed
  get watchProgress() {
    const maximum = Number(this.source.resume?.total);
    const current = Number(this.source.resume?.position);
    return current / maximum * 100;
  }
  
  @mobx.observable
  source: api.models.MovieEntry;
}
