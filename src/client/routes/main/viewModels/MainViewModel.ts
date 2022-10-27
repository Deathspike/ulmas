import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel implements app.menu.IController {
  constructor() {
    this.menu = new app.menu.MainViewModel(this);
    mobx.makeObservable(this);
  }
    
  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'enter' || keyName === 'space') {
      this.currentPlayer?.continue();
      return true;
    } else if (keyName === 'escape' && this.menu.search.current.value && !this.currentPlayer?.isActive) {
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
  async handleEventAsync(event: api.models.Event) {
    if (event.type === 'sections') {
      await this.refreshAsync();
    } else if (event.type === 'movies') {
      await this.refreshAsync();
    } else if (event.type === 'series') {
      await this.refreshAsync();
    }
  }

  @mobx.action
  async refreshAsync() {
    await core.screen.waitAsync(async () => {
      const response = await core.api.sections.readAsync();
      const sections = await this.fetchSectionsAsync(response.value);
      if (sections.every(Boolean)) {
        this.source = sections
          .map(x => x!)
          .sort((a, b) => a.title.localeCompare(b.title));
      } else {
        // TODO: Handle error.
      }
    });
  }

  @mobx.action
  async scanAsync() {
    if (!this.source) return;
    await Promise.all(this.source.map(x => x.type === 'movies'
      ? core.scan.moviesAsync(x.id)
      : core.scan.seriesAsync(x.id)));
  }

  @mobx.computed
  get continueWatching() {
    const result = this.source
      ?.flatMap(x => x.continueWatching as Array<app.movies.MovieViewModel | app.series.SeriesViewModel>)
      ?.sort((a, b) => api.sortBy(a.source, b.source, 'lastPlayed'))
      ?.reverse()
      ?.slice(0, 6);
    return result?.length
      ? result
      : undefined;
  }

  @mobx.computed
  get isScanning() {
    if (!this.source) return false;
    return this.source.some(x => x.type === 'movies'
      ? core.scan.hasMovies(x.id)
      : core.scan.hasSeries(x.id));
  }

  @mobx.computed
  get searchResults() {
    if (!this.source || !this.menu.search.debounceValue) return;
    return Array.from(ui.createPages(24, this.source
      .flatMap(x => x.source as Array<app.movies.MovieViewModel | app.series.SeriesViewModel>)
      .filter(app.createFilter(this.menu))
      .sort(app.createSort(this.menu))));
  }

  @mobx.observable
  currentPlayer?: app.movies.PlayerViewModel | app.series.PlayerViewModel;

  @mobx.observable
  menu: app.menu.MainViewModel;
  
  @mobx.observable
  source?: Array<app.SectionViewModel>;

  async fetchSectionsAsync(sections?: Array<api.models.Section>) {
    return await Promise.all(sections?.map(async (section) => {
      switch (section.type) { 
        case 'movies':
          const movie = await core.api.movies.getListAsync(section.id);
          return movie.value && new app.SectionViewModel(this, section, movie.value);
        case 'series':
          const series = await core.api.series.getListAsync(section.id);
          return series.value && new app.SectionViewModel(this, section, series.value);
        default:
          throw new Error();
      }
    }) ?? []);
  }
}
