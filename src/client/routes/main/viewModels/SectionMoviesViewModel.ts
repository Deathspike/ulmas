import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';

export class SectionMoviesViewModel implements app.movies.IController {
  constructor(private readonly mvm: app.MainViewModel, section: api.models.Section, source: Array<api.models.MovieEntry>) {
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
    routes.movies.main(this.id);
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
      .filter(x => x.lastPlayed && !x.watched)
      .sort((a, b) => api.sortMovies(a, b, 'lastPlayed'))
      .reverse()
      .slice(0, 6)
      .map(x => new app.movies.MovieViewModel(this, this.id, x));
  }

  @mobx.computed
  get currentPlayer() {
    return this.mvm.currentPlayer instanceof app.movies.PlayerViewModel
      ? this.mvm.currentPlayer
      : undefined;
  }

  @mobx.computed
  get latest() {
    return this.source
      .slice()
      .sort((a, b) => api.sortMovies(a, b, 'dateAdded'))
      .reverse()
      .slice(0, 6)
      .map(x => new app.movies.MovieViewModel(this, this.id, x));
  }

  @mobx.computed
  get viewState() {
    return this.mvm.viewState;
  }

  @mobx.observable
  id: string;
  
  @mobx.observable
  source: Array<api.models.MovieEntry>;

  @mobx.observable
  title: string;
}