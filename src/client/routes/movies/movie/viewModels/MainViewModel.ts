import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string, private readonly movieId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'escape') {
      this.onBackAsync();
      return true;
    } else if (keyName === 'space') {
      if (this.currentPlayer?.isActive) return true;
      this.playAsync();
      return true;
    } else {
      return false;
    }
  }

  @mobx.action
  async onBackAsync() {
    if (this.currentPlayer?.isActive) {
      this.currentPlayer.close();
    } else {
      await core.screen.backAsync();
    }
  }

  @mobx.action
  async markAsync() {
    await core.screen.waitAsync(async () => {
      if (!this.source) return;
      await app.core.watchedAsync(this.sectionId, this.source, !this.source.watched);
    });
  }

  @mobx.action
  async playAsync() {
    if (!this.source) return;
    this.currentPlayer = new app.core.PlayerViewModel(this.sectionId, this.source);
    this.currentPlayer.load();
    await this.currentPlayer.waitAsync();
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

  @mobx.computed
  get posterUrl() {
    return this.source
      ? core.image.movie(this.sectionId, this.source, 'poster')
      : undefined;
  }

  @mobx.observable
  currentPlayer?: app.core.PlayerViewModel;

  @mobx.observable
  source?: api.models.Movie;
}
