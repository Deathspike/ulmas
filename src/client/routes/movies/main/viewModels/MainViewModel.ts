import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel implements app.menu.IController, app.movies.IController {
  constructor(private readonly sectionId: string) {
    this.menu = new app.menu.MainViewModel(this);
    mobx.makeObservable(this);
  }
  
  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'escape' && this.menu.search.current.value && !this.currentPlayer?.isActive) {
      this.menu.search.clear();
      return true;
    } else if (keyName === 'escape') {
      this.onBackAsync();
      return true;
    } else {
      return false;
    }
  }

  @mobx.action
  handleEvent(event: api.models.Event) {
    if (event.source === 'movies'
      && event.reason === 'update'
      && !event.resourceId) {
      this.refreshAsync();
    } else if (event.source === 'sections'
      && event.reason === 'delete'
      && event.sectionId === this.sectionId) {
      core.screen.backAsync();
      this.currentPlayer?.close();
    }
  }

  @mobx.action
  async onBackAsync() {
    if (this.currentPlayer?.isActive) {
      this.currentPlayer.close();
    } else if (this.menu.search.current.value) {
      this.menu.search.clear();
    } else {
      await core.screen.backAsync();
    }
  }

  @mobx.action
  async refreshAsync() {
    await core.screen.waitAsync(async () => {
      const sectionsPromise = core.api.sections.readAsync();
      const moviesPromise = core.api.movies.entriesAsync(this.sectionId);
      const section = await sectionsPromise.then(x => x.value?.find(x => x.id === this.sectionId));
      const movies = await moviesPromise;
      if (section && movies.value) {
        this.source = movies.value;
        this.title = section.title;
      } else if (section) {
        // TODO: Handle error.
      } else {
        // TODO: Handle section not found.
      }
    });
  }

  @mobx.action
  async playAsync(movie: api.models.Movie) {
    this.currentPlayer = new app.movies.PlayerViewModel(this.sectionId, movie);
    this.currentPlayer.load();
    await this.currentPlayer.waitAsync();
  }

  @mobx.computed
  get pages() {
    if (!this.source) return;
    return Array.from(ui.createPages(24, this.source
      .filter(app.menu.createFilter(this.menu))
      .sort(app.menu.createSort(this.menu))
      .map(x => new app.movies.MovieViewModel(this, this.sectionId, x))));
  }

  @mobx.observable
  currentPlayer?: app.movies.PlayerViewModel;

  @mobx.observable
  menu: app.menu.MainViewModel;
  
  @mobx.observable
  source?: Array<api.models.MovieEntry>;

  @mobx.observable
  title?: string;
}
