import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel implements app.core.IController {
  constructor(private readonly sectionId: string, viewState?: app.ViewState) {
    this.menu = new app.MenuViewModel(this, viewState);
    mobx.makeObservable(this);
  }
  
  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'escape' && this.menu.search.value && !this.currentPlayer?.isActive) {
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
    } else {
      await core.screen.backAsync();
    }
  }

  @mobx.action
  async refreshAsync() {
    // TODO: Handle section not found.
    await core.screen.waitAsync(async () => {
      const sectionsPromise = core.api.sections.readAsync();
      const moviesPromise = core.api.movies.entriesAsync(this.sectionId);
      const sections = await sectionsPromise;
      const movies = await moviesPromise;
      if (sections.value && movies.value) {
        this.source = movies.value;
        this.title = sections.value.find(x => x.id === this.sectionId)?.title;
        requestAnimationFrame(() => window.scrollTo(0, 0));
      } else {
        // TODO: Handle error.
      }
    });
  }

  @mobx.action
  async playAsync(movie: api.models.Movie) {
    this.currentPlayer = new app.core.PlayerViewModel(this.sectionId, movie);
    this.currentPlayer.load();
    await this.currentPlayer.waitAsync();
  }

  @mobx.computed
  get pages() {
    if (!this.source) return;
    const movies = this.source
      .filter(app.createFilter(this.menu))
      .sort(app.createSort(this.menu))
      .map(x => new app.core.MovieViewModel(this, this.sectionId, x));
    return Array.from(ui.createPages(24, this.menu.ascending
      ? movies
      : movies.reverse()));
  }

  @mobx.computed
  get viewState() {
    return new app.ViewState(this.menu.search.value);
  }
  
  @mobx.observable
  currentPlayer?: app.core.PlayerViewModel;

  @mobx.observable
  menu: app.MenuViewModel;
  
  @mobx.observable
  source?: Array<api.models.MovieEntry>;

  @mobx.observable
  title?: string;
}
