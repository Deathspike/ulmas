import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string, private readonly seriesId: string) {
    this.menu = new app.MenuViewModel(this);
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'enter') {
      this.currentPlayer?.continue();
      return true;
    } else if (keyName === 'escape') {
      this.onBackAsync();
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
    } else if (event.type === 'series') {
      await this.refreshAsync();
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
      if (episodes && this.source) {
        const watched = !!this.unwatchedCount;
        const model = api.models.SeriesPatch.create(episodes.map(x => x.source), watched);
        await core.api.series.patchItemAsync(this.sectionId, this.source.id, model);
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
    await core.screen.waitAsync(async (exclusiveLock) => {
      const series = await core.api.series.getItemAsync(this.sectionId, this.seriesId);
      if (series.value) {
        this.source = series.value;
        const episodes = this.source.episodes
          .sort((a, b) => a.season - b.season || a.episode - b.episode)
          .map(x => new app.EpisodeViewModel(this, this.sectionId, x));
        this.seasons = Array.from(new Set(episodes.map(x => x.source.season)))
          .sort((a, b) => a - b)
          .map(x => new app.SeasonViewModel(this, this.sectionId, x, episodes.filter(y => y.source.season === x)));
        this.currentSeason = this.seasons.length !== 1
          ? this.seasons.find(x => x.season === this.currentSeason?.season)
          : this.seasons[0];
      } else if (series.status === 404) {
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
      ? core.image.series(this.sectionId, this.source, 'poster')
      : undefined;
  }
  
  @mobx.computed
  get unwatchedCount() {
    return this.source?.episodes.filter(x => !x.watched).length;
  }

  @mobx.computed
  get watchProgress() {
    const maximum = Number(this.source?.totalCount);
    const current = maximum - Number(this.unwatchedCount);
    return current / maximum * 100;
  }

  @mobx.observable
  currentPlayer?: app.series.PlayerViewModel;

  @mobx.observable
  currentSeason?: app.SeasonViewModel;

  @mobx.observable
  menu: app.MenuViewModel;

  @mobx.observable
  seasons?: Array<app.SeasonViewModel>;

  @mobx.observable
  source?: Omit<api.models.Series, 'unwatchedCount'>;

  private async loadAsync(episodes: Array<api.models.Episode>, current?: api.models.Episode) {
    if (this.currentPlayer?.isActive) {
      this.currentPlayer.continue();
      await this.currentPlayer.waitAsync();
    } else if (this.source) {
      this.currentPlayer = new app.series.PlayerViewModel(this.sectionId, this.source.id, episodes, current);
      this.currentPlayer.load();
      await this.currentPlayer.waitAsync();
    }
  }
}
