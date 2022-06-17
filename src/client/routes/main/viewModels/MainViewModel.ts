import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor() {
    mobx.makeObservable(this);
  }
    
  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'escape') {
      this.currentPlayer?.close();
      return true;
    } else {
      return false;
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
      ?.sort((a, b) => api.sortMovies(a.source, b.source, 'lastPlayed'))
      ?.reverse()
      ?.slice(0, 6);
    return result?.length
      ? result
      : undefined;
  }

  @mobx.computed
  get viewState() {
    return undefined;
  }

  @mobx.observable
  currentPlayer?: app.movies.PlayerViewModel | app.series.PlayerViewModel;

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
