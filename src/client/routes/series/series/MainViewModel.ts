import * as api from 'api';
import * as app from '.';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly seriesId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  onBack() {
    if (this.currentSeason && this.seasons && this.seasons.length > 1) {
      this.currentSeason = undefined;
    } else {
      history.back();
    }
  }

  @mobx.action
  play(episode?: api.models.Episode) {
    if (this.series && this.seasons) {
      const episodes = this.currentSeason
        ? this.currentSeason.episodes
        : this.seasons.flatMap(x => x.episodes);
      episode ??= episodes.find(x => x.season && !x.watched)
        ?? episodes.find(x => !x.watched)
        ?? episodes[0];
      if (episode) {
        this.currentPlayer = new app.PlayerViewModel(this.sectionId, this.series, episodes, episode);
        this.currentPlayer.load();
      }
    }
  }

  @mobx.action
  async refreshAsync() {
    const series = await core.api.series.itemAsync(this.sectionId, this.seriesId);
    if (series.value) {
      const episodes = series.value.episodes
        .sort((a, b) => a.episode - b.episode);
      this.seasons = Array.from(new Set(series.value.episodes.map(x => x.season)))
        .map(x => new app.SeasonViewModel(x, episodes.filter(y => y.season === x)))
        .sort((a, b) => a.season - b.season);
      this.currentSeason = this.seasons.length !== 1
        ? this.seasons.find(x => x.season === this.currentSeason?.season)
        : this.seasons[0];
      this.series = series.value;
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
  get watched() {
    return this.currentSeason
      ? !this.currentSeason.unwatchedCount
      : !this.series?.episodes.some(x => !x.watched);
  }

  @mobx.observable
  currentPlayer?: app.PlayerViewModel;

  @mobx.observable
  currentSeason?: app.SeasonViewModel;

  @mobx.observable
  seasons?: Array<app.SeasonViewModel>;

  @mobx.observable
  series?: api.models.Series;
}
