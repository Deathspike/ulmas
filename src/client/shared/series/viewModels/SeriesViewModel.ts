import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';
import {core} from 'client/core';

export class SeriesViewModel {
  constructor(private readonly controller: app.IController, private readonly sectionId: string, source: api.models.SeriesEntry) {
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (this.controller.currentPlayer?.isActive) {
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
    const viewState = this.controller.viewState;
    routes.series.series(this.sectionId, this.source.id, viewState);
  }

  @mobx.action
  async playAsync() {
    const series = await core.screen
      .waitAsync(() => core.api.series.itemAsync(this.sectionId, this.source.id))
      .then(x => x.value && mobx.makeAutoObservable(new api.models.Series(x.value)));
    if (series) {
      const disposer = mobx.autorun(() => updateState(this.source, series));
      await this.controller.playAsync(series);
      disposer();
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get posterUrl() {
    return core.image.series(this.sectionId, this.source, 'poster');
  }

  @mobx.computed
  get watchProgress() {
    const maximum = Number(this.source.totalCount);
    const current = maximum - Number(this.source.unwatchedCount);
    return current / maximum * 100;
  }
  
  @mobx.observable
  source: api.models.SeriesEntry;
}

function updateState(source: Writeable<api.models.SeriesEntry>, series: api.models.Series) {
  source.unwatchedCount = series.episodes
    .filter(x => !x.watched)
    .length || undefined;
}
