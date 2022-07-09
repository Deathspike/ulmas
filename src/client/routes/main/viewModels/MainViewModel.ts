import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel {
  constructor(viewState?: app.ViewState) {
    this.menu = new app.MenuViewModel(this, viewState);
    mobx.makeObservable(this);
  }
    
  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'enter' || keyName === 'space') {
      this.currentPlayer?.continue();
      return true;
    } else if (keyName === 'escape' && this.menu.search.value && !this.currentPlayer?.isActive) {
      this.menu.search.clear();
      return true;
    } else if (keyName === 'escape') {
      this.currentPlayer?.close();
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
    } else if (event.source === 'series'
      && event.reason === 'update'
      && !event.resourceId) {
      this.refreshAsync();
    }
  }

  @mobx.action
  async refreshAsync() {
    const response = await core.api.sections.readAsync();
    const sections = response.value && await this.fetchSectionsAsync(response.value);
    if (sections?.every(Boolean)) {
      this.sections = sections.map(x => x!).sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get continueWatching() {
    const result = this.sections
      ?.flatMap(x => x.continueWatching as Array<app.movies.MovieViewModel | app.series.SeriesViewModel>)
      ?.sort((a, b) => api.sortBy(a.source, b.source, 'lastPlayed'))
      ?.reverse()
      ?.slice(0, 6);
    return result?.length
      ? result
      : undefined;
  }

  @mobx.computed
  get searchResults() {
    if (!this.menu.search.debounceValue) return;
    const result = this.sections
      ?.flatMap(x => x.viewModels as Array<app.movies.MovieViewModel | app.series.SeriesViewModel>)
      ?.filter(app.createFilter(this.menu))
      ?.sort((a, b) => api.sortBy(a.source, b.source, 'title'));
    return result
      ? Array.from(ui.createPages(24, result))
      : undefined;
  }

  @mobx.computed
  get viewState() {
    return new app.ViewState(this.menu.search.value);
  }

  @mobx.observable
  currentPlayer?: app.movies.PlayerViewModel | app.series.PlayerViewModel;

  @mobx.observable
  menu: app.MenuViewModel;
  
  @mobx.observable
  sections?: Array<app.SectionMoviesViewModel | app.SectionSeriesViewModel>;

  async fetchSectionsAsync(sections: Array<api.models.Section>) {
    return await Promise.all(sections.map(async (section) => {
      switch (section.type) { 
        case 'movies':
          const movie = await core.api.movies.entriesAsync(section.id);
          return movie.value && new app.SectionMoviesViewModel(this, section, movie.value);
        case 'series':
          const series = await core.api.series.entriesAsync(section.id);
          return series.value && new app.SectionSeriesViewModel(this, section, series.value);
        default:
          throw new Error();
      }
    }));
  }
}
