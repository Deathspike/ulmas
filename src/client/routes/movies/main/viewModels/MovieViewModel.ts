import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as routes from 'client/routes';
import {core} from 'client/core';

export class MovieViewModel {
  constructor(private readonly mvm: app.MainViewModel, private readonly sectionId: string, source: api.models.MovieEntry) {
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
    routes.movies.movie(this.sectionId, this.source.id, this.mvm.viewState);
  }

  @mobx.action
  async playAsync() {
    const movie = await core.screen
      .waitAsync(() => core.api.movies.itemAsync(this.sectionId, this.source.id))
      .then(x => x.value && mobx.makeAutoObservable(new api.models.Movie(x.value)));
    if (movie) {
      const disposer = mobx.autorun(() => updateWatched(this.source, movie));
      await this.mvm.playAsync(movie);
      disposer();
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get posterUrl() {
    return core.image.movie(this.sectionId, this.source, 'poster');
  }
  
  @mobx.observable
  source: api.models.MovieEntry;
}

function updateWatched(source: Writeable<api.models.MovieEntry>, movie: api.models.Movie) {
  source.watched = movie.watched;
}
