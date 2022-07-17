import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';

export class SectionMoviesViewModel implements app.movies.IController {
  constructor(private readonly mvm: app.MainViewModel, section: api.models.Section, source: Array<api.models.MovieEntry>) {
    this.id = section.id;
    this.source = source.map(x => new app.movies.MovieViewModel(this, this.id, x));
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
    routes.movies.main.open(this.id);
  }

  @mobx.action
  async playAsync(movie: api.models.Movie) {
    this.mvm.currentPlayer = new app.movies.PlayerViewModel(this.id, movie);
    this.mvm.currentPlayer.load();
    await this.mvm.currentPlayer.waitAsync();
  }

  @mobx.computed
  get continueWatching() {
    return this.source
      .filter(x => x.source.lastPlayed && !x.source.watched)
      .sort((a, b) => api.sortBy(a.source, b.source, 'lastPlayed'))
      .reverse()
      .slice(0, 6);
  }

  @mobx.computed
  get currentPlayer() {
    return this.mvm.currentPlayer instanceof app.movies.PlayerViewModel
      ? this.mvm.currentPlayer
      : undefined;
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
  source: Array<app.movies.MovieViewModel>;

  @mobx.observable
  title: string;
}
