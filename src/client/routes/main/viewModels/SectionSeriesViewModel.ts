import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';

export class SectionSeriesViewModel implements app.series.IController {
  constructor(private readonly mvm: app.MainViewModel, section: api.models.Section, source: Array<api.models.SeriesEntry>) {
    this.id = section.id;
    this.source = source.map(x => new app.series.SeriesViewModel(this, this.id, x));
    this.title = section.title;
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (keyName === 'enter') {
      this.open();
      return true;
    } else {
      return false;
    }
  }
  
  @mobx.action
  open() {
    routes.series.main.router(this.id);
  }

  @mobx.action
  async playAsync(series: api.models.Series) {
    this.mvm.currentPlayer = new app.series.PlayerViewModel(this.id, series.id, series.episodes);
    this.mvm.currentPlayer.load();
    await this.mvm.currentPlayer.waitAsync();
  }

  @mobx.computed
  get continueWatching() {
    return this.source
      .filter(x => x.source.lastPlayed && x.source.unwatchedCount)
      .sort((a, b) => api.sortBy(a.source, b.source, 'lastPlayed'))
      .reverse()
      .slice(0, 6);
  }

  @mobx.computed
  get previewItems() {
    return this.source
      .filter(app.createFilter(this.mvm.menu))
      .sort(app.createSort(this.mvm.menu))
      .slice(0, 6);
  }

  @mobx.observable
  id: string;

  @mobx.observable
  source: Array<app.series.SeriesViewModel>;

  @mobx.observable
  title: string;
}
