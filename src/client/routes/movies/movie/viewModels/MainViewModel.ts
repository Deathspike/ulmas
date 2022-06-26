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
  handleEvent(event: api.models.Event) {
    if (event.source === 'movies'
      && event.reason === 'delete'
      && event.resourceId === this.movieId) {
      core.screen.backAsync();
      this.currentPlayer?.close();
    } else if (event.source === 'movies'
      && event.reason === 'update'
      && event.resourceId === this.movieId) {
      this.refreshAsync();
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
      const model = api.models.MoviePatch.create(!this.source.watched);
      await core.api.movies.patchAsync(this.sectionId, this.source.id, model);
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
    await core.screen.waitAsync(async () => {
      const movie = await core.api.movies.itemAsync(this.sectionId, this.movieId);
      if (movie.value) {
        this.source = movie.value;
      } else {
        // TODO: Handle error.
      }
    });
  }

  @mobx.computed
  get posterUrl() {
    return this.source
      ? core.image.movie(this.sectionId, this.source, 'poster')
      : undefined;
  }

  @mobx.computed
  get watchProgress() {
    const maximum = Number(this.source?.resume?.total);
    const current = Number(this.source?.resume?.position);
    return current / maximum * 100;
  }

  @mobx.observable
  currentPlayer?: app.core.PlayerViewModel;

  @mobx.observable
  source?: api.models.Movie;
}
