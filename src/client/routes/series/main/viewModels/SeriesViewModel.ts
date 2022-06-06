import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';
import {core} from 'client/core';

export class SeriesViewModel {
  constructor(private readonly mvm: app.MainViewModel, private readonly sectionId: string, source: api.models.SeriesEntry) {
    this.source = source;
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
    routes.series.series(this.sectionId, this.source.id);
  }

  @mobx.action
  async playAsync() {
    const series = await core.screen
      .waitAsync(() => core.api.series.itemAsync(this.sectionId, this.source.id))
      .then(x => x.value && mobx.makeAutoObservable(x.value));
    if (series) {
      const disposer = mobx.autorun(() => this.updateUnwatchedCount(series));
      await this.mvm.playAsync(series);
      disposer();
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get posterUrl() {
    return core.image.series(this.sectionId, this.source, 'poster');
  }
  
  @mobx.observable
  source: Writeable<api.models.SeriesEntry>;

  private updateUnwatchedCount(series: api.models.Series) {
    this.source.unwatchedCount = series.episodes
      .filter(x => !x.watched)
      .length || undefined;
  }
}
