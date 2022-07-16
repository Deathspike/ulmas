import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string, private readonly movieId: string) {
    this.menu = new app.MenuViewModel(this);
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'escape') {
      this.onBackAsync();
      return true;
    } else if (keyName === 'space' && this.currentPlayer?.isActive) {
      this.currentPlayer.continue();
      return true;
    } else if (keyName === 'space') {
      this.playAsync();
      return true;
    } else {
      return false;
    }
  }

  @mobx.action
  async handleEventAsync(event: api.models.Event) {
    if (event.sectionId !== this.sectionId) {
      return;
    } else if (event.type === 'sections') {
      await this.refreshAsync();
    } else if (event.type === 'movies') {
      await this.refreshAsync();
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
    this.currentPlayer = new app.movies.PlayerViewModel(this.sectionId, this.source);
    this.currentPlayer.load();
    await this.currentPlayer.waitAsync();
  }

  @mobx.action
  async refreshAsync() {
    await core.screen.waitAsync(async (exclusiveLock) => {
      const movie = await core.api.movies.itemAsync(this.sectionId, this.movieId);
      if (movie.value) {
        this.source = movie.value;
      } else if (movie.status === 404) {
        this.currentPlayer?.close();
        exclusiveLock.resolve();
        await core.screen.backAsync();
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
  currentPlayer?: app.movies.PlayerViewModel;

  @mobx.observable
  menu: app.MenuViewModel;

  @mobx.observable
  source?: api.models.Movie;
}
