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
    const viewState = this.mvm.viewState;
    routes.series.main(this.id, viewState);
  }

  @mobx.action
  async playAsync(series: api.models.Series) {
    this.mvm.currentPlayer = new app.series.PlayerViewModel(this.id, series.id, series.episodes);
    this.mvm.currentPlayer.load();
    await this.mvm.currentPlayer.waitAsync();
  }

  @mobx.computed
  get continueWatching() {
    return this.viewModels
      .filter(x => x.source.lastPlayed && x.source.unwatchedCount)
      .sort((a, b) => api.sortBy(a.source, b.source, 'lastPlayed'))
      .reverse()
      .slice(0, 6);
  }

  @mobx.computed
  get currentPlayer() {
    return this.mvm.currentPlayer instanceof app.series.PlayerViewModel
      ? this.mvm.currentPlayer
      : undefined;  
  }

  @mobx.computed
  get latest() {
    return this.viewModels
      .slice()
      .sort((a, b) => api.sortBy(a.source, b.source, 'dateEpisodeAdded'))
      .reverse()
      .slice(0, 6);
  }

  @mobx.computed
  get viewModels() {
    return this.source.map(x => new app.series.SeriesViewModel(this, this.id, x));
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
