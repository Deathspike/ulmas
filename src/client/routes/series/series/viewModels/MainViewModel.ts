import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string, private readonly seriesId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  onBack() {
    if (this.currentSeason && this.seasons && this.seasons.length > 1) {
      this.currentSeason = undefined;
    } else {
      this.currentPlayer?.close();
      core.screen.backAsync();
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
  async playAsync(current?: app.EpisodeViewModel) {
    const episodes = this.currentSeason
      ? this.currentSeason.episodes
      : this.seasons?.flatMap(x => x.episodes);
    if (episodes) {
      this.currentPlayer = new app.core.PlayerViewModel(this.sectionId, this.seriesId, episodes.map(x => x.source), current?.source);
      this.currentPlayer.load();
      await this.currentPlayer.waitAsync();
    }
  }

  @mobx.action
  async refreshAsync() {
    const series = await core.api.series.itemAsync(this.sectionId, this.seriesId);
    if (series.value) {
      const episodes = series.value.episodes
        .sort((a, b) => a.season - b.season || a.episode - b.episode)
        .map(x => new app.EpisodeViewModel(this, this.sectionId, x));
      this.seasons = Array.from(new Set(series.value.episodes.map(x => x.season)))
        .sort((a, b) => a - b)
        .map(x => new app.SeasonViewModel(this, this.sectionId, x, episodes.filter(y => y.source.season === x)));
      this.currentSeason = this.seasons.length !== 1
        ? this.seasons.find(x => x.season === this.currentSeason?.season)
        : this.seasons[0];
      this.source = series.value;
    } else {
      // TODO: Handle error.
      // TODO: Handle refreshes for `currentPlayer`.
    }
  }

  @mobx.action
  selectSeason(season: app.SeasonViewModel) {
    this.currentSeason = season;
  }

  @mobx.computed
  get posterUrl() {
    return this.source
      ? core.image.series(this.sectionId, this.source, 'poster')
      : undefined;
  }

  @mobx.computed
  get watched() {
    return this.currentSeason
      ? !this.currentSeason.unwatchedCount
      : !this.source?.episodes.some(x => !x.watched);
  }

  @mobx.observable
  currentPlayer?: app.core.PlayerViewModel;

  @mobx.observable
  currentSeason?: app.SeasonViewModel;

  @mobx.observable
  seasons?: Array<app.SeasonViewModel>;

  @mobx.observable
  source?: api.models.Series;
}
