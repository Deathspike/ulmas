import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class SeasonViewModel {
  constructor(private readonly mvm: app.MainViewModel, private readonly sectionId: string, season: number, episodes: Array<app.EpisodeViewModel>) {
    this.episodes = episodes;
    this.season = season;
    this.title = app.getSeasonTitle(season);
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (this.mvm.currentPlayer?.isActive) {
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
    core.state.save();
    this.mvm.currentSeason = this;
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  @mobx.action
  async playAsync() {
    await this.mvm.playSeasonAsync(this);
  }

  @mobx.computed
  get pages() {
    return Array.from(ui.createPages(4, this.episodes));
  }

  @mobx.computed
  get posterUrl() {
    return this.mvm.source
      ? core.image.series(this.sectionId, this.mvm.source, app.getSeasonPoster(this.season), 'poster')
      : undefined;
  }

  @mobx.computed
  get unwatchedCount() {
    return this.episodes.filter(x => !x.source.watched).length;
  }
  
  @mobx.observable
  episodes: Array<app.EpisodeViewModel>;

  @mobx.observable
  season: number;

  @mobx.observable
  title: string;
}
