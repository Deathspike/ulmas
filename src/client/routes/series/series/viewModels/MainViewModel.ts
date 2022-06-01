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
  play(current?: app.EpisodeViewModel) {
    if (this.seasons) {
      const episodes = this.currentSeason
        ? this.currentSeason.episodes
        : this.seasons.flatMap(x => x.episodes);
      current ??= episodes.find(x => x.source.season && !x.source.watched)
        ?? episodes.find(x => !x.source.watched)
        ?? episodes[0];
      if (current) {
        this.currentPlayer = new app.PlayerViewModel(this.sectionId, this.seriesId, episodes, current);
        this.currentPlayer.load();
      }
    }
  }

  @mobx.action
  async refreshAsync() {
    const series = await core.api.series.itemAsync(this.sectionId, this.seriesId);
    if (series.value) {
      const episodes = series.value.episodes
        .sort((a, b) => a.episode - b.episode)
        .map(x => new app.EpisodeViewModel(x => this.play(x), this.sectionId, this.seriesId, x));
      this.seasons = Array.from(new Set(series.value.episodes.map(x => x.season)))
        .sort((a, b) => a - b)
        .map(x => new app.SeasonViewModel(this.sectionId, series.value!, x, episodes.filter(y => y.source.season === x)));
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
  currentPlayer?: app.PlayerViewModel;

  @mobx.observable
  currentSeason?: app.SeasonViewModel;

  @mobx.observable
  seasons?: Array<app.SeasonViewModel>;

  @mobx.observable
  source?: api.models.Series;
}
