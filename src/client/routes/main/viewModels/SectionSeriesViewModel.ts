import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';

export class SectionSeriesViewModel implements app.series.IController {
  constructor(private readonly mvm: app.MainViewModel, section: api.models.Section, source: Array<api.models.SeriesEntry>) {
    this.id = section.id;
    this.source = source;
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
    routes.series.main(this.id);
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
      .filter(x => x.lastPlayed && x.unwatchedCount)
      .sort((a, b) => api.sortSeries(a, b, 'lastPlayed'))
      .reverse()
      .slice(0, 6)
      .map(x => new app.series.SeriesViewModel(this, this.id, x));
  }

  @mobx.computed
  get currentPlayer() {
    return this.mvm.currentPlayer instanceof app.series.PlayerViewModel
      ? this.mvm.currentPlayer
      : undefined;  
  }

  @mobx.computed
  get latest() {
    return this.source
      .slice()
      .sort((a, b) => api.sortSeries(a, b, 'dateEpisodeAdded'))
      .reverse()
      .slice(0, 6)
      .map(x => new app.series.SeriesViewModel(this, this.id, x));
  }

  @mobx.computed
  get viewState() {
    return this.mvm.viewState;
  }

  @mobx.observable
  id: string;

  @mobx.observable
  source: Array<api.models.SeriesEntry>;

  @mobx.observable
  title: string;
}
