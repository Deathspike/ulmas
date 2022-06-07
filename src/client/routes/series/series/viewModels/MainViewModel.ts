import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string, private readonly seriesId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'enter' || keyName === 'space') {
      this.currentPlayer?.continue();
      return true;
    } else if (keyName === 'escape') {
      this.onBackAsync();
      return true;
    } else {
      return false;
    }
  }

  @mobx.action
  async onBackAsync() {
    if (this.currentPlayer?.isActive) {
      this.currentPlayer.close();
    } else if (this.currentSeason && this.seasons && this.seasons.length > 1) {
      this.currentSeason = undefined;
      requestAnimationFrame(() => core.state.replace());
    } else {
      await core.screen.backAsync();
    }
  }

  @mobx.action
  async markAsync() {
    await core.screen.waitAsync(async () => {
      const episodes = this.currentSeason
        ? this.currentSeason.episodes
        : this.seasons?.flatMap(x => x.episodes);
      if (episodes) {
        await app.core.watchedAsync(this.sectionId, this.seriesId, episodes.map(x => x.source), !this.watched);
      }
    });
  }

  @mobx.action
  async playAsync() {
    if (!this.source) return;
    await (this.currentSeason ? this.playSeasonAsync(this.currentSeason) : this.loadAsync(this.source.episodes));
  }

  @mobx.action
  async playEpisodeAsync(current: app.EpisodeViewModel) {
    if (!this.source) return;
    await this.loadAsync(this.source.episodes.filter(x => x.season === current.source.season), current.source)
  }

  @mobx.action
  async playSeasonAsync(current: app.SeasonViewModel) {
    if (!this.source) return;
    await this.loadAsync(this.source.episodes.filter(x => x.season === current.season))
  }

  @mobx.action
  async refreshAsync() {
    const series = await core.api.series.itemAsync(this.sectionId, this.seriesId);
    if (series.value) {
      this.source = series.value;
      const episodes = this.source.episodes
        .sort((a, b) => a.season - b.season || a.episode - b.episode)
        .map(x => new app.EpisodeViewModel(this, this.sectionId, x));
      this.seasons = Array.from(new Set(this.source.episodes.map(x => x.season)))
        .sort((a, b) => a - b)
        .map(x => new app.SeasonViewModel(this, this.sectionId, x, episodes.filter(y => y.source.season === x)));
      this.currentSeason = this.seasons.length !== 1
        ? this.seasons.find(x => x.season === this.currentSeason?.season)
        : this.seasons[0];
    } else {
      // TODO: Handle error.
      // TODO: Handle refreshes for `currentPlayer`.
    }
  }

  @mobx.computed
  get posterUrl() {
    return this.source
      ? core.image.series(this.sectionId, this.source, 'poster')
      : undefined;
  }
  
  @mobx.computed
  get unwatchedCount() {
    return this.currentSeason
      ? this.currentSeason.unwatchedCount
      : this.source?.episodes.filter(x => !x.watched).length;
  }

  @mobx.computed
  get watched() {
    return !this.unwatchedCount;
  }

  @mobx.observable
  currentPlayer?: app.core.PlayerViewModel;

  @mobx.observable
  currentSeason?: app.SeasonViewModel;

  @mobx.observable
  seasons?: Array<app.SeasonViewModel>;

  @mobx.observable
  source?: Omit<api.models.Series, 'unwatchedCount'>;

  private async loadAsync(episodes: Array<api.models.Episode>, current?: api.models.Episode) {
    this.currentPlayer = new app.core.PlayerViewModel(this.sectionId, this.seriesId, episodes, current);
    this.currentPlayer.load();
    await this.currentPlayer.waitAsync();
  }
}
