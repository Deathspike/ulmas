import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';

export class SectionViewModel implements app.movies.IController, app.series.IController {
  constructor(private readonly mvm: app.MainViewModel, section: api.models.Section, source: Array<api.models.Movie | api.models.SeriesEntry>) {
    this.id = section.id;
    this.source = source.map(x => this.createItemModel(x));
    this.title = section.title;
    this.type = section.type;
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
    if (this.type === 'movies') {
      routes.movies.main.open(this.id);
    } else {
      routes.series.main.open(this.id);
    }
  }

  @mobx.action
  async playAsync(value: api.models.Movie | api.models.Series) {
    if (this.mvm.currentPlayer?.isActive) {
      this.mvm.currentPlayer.continue();
      await this.mvm.currentPlayer.waitAsync();
    } else {
      this.mvm.currentPlayer = this.createPlayerModel(value);
      this.mvm.currentPlayer.load();
      await this.mvm.currentPlayer.waitAsync();
    }
  }

  @mobx.computed
  get continueWatching() {
    return this.source
      .filter(x => x.source.lastPlayed && isUnwatched(x.source))
      .sort((a, b) => api.sortBy(a.source, b.source, 'lastPlayed'))
      .reverse()
      .slice(0, 6);
  }

  @mobx.computed
  get currentPlayer(): any {
    return this.mvm.currentPlayer;
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
  source: Array<app.movies.MovieViewModel | app.series.SeriesViewModel>;

  @mobx.observable
  title: string;

  @mobx.observable
  type: string;

  private createItemModel(value: api.models.Movie | api.models.SeriesEntry) {
    return value instanceof api.models.MovieEntry
      ? new app.movies.MovieViewModel(this, this.id, value)
      : new app.series.SeriesViewModel(this, this.id, value);
  }

  private createPlayerModel(value: api.models.Movie | api.models.Series) {
    return value instanceof api.models.Movie
      ? new app.movies.PlayerViewModel(this.id, value)
      : new app.series.PlayerViewModel(this.id, value.id, value.episodes);
  }
}

function isUnwatched(value: api.models.MovieEntry | api.models.SeriesEntry) {
  return value instanceof api.models.MovieEntry
    ? !value.watched
    : Boolean(value.unwatchedCount);
}
