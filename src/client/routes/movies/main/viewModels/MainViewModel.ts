import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    // TODO: Handle section not found.
    const sectionsPromise = core.api.sections.readAsync();
    const moviesPromise = core.api.movies.entriesAsync(this.sectionId);
    const sections = await sectionsPromise;
    const movies = await moviesPromise;
    if (sections.value && movies.value) {
      this.movies = movies.value.map(x => new app.MovieViewModel(this.sectionId, x));
      this.title = sections.value.find(x => x.id === this.sectionId)?.title;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get pages() {
    if (!this.movies) return;
    return Array.from(ui.createPages(24, this.movies.slice().sort((a, b) => {
      return b.source.dateAdded.localeCompare(a.source.dateAdded);
    })));
  }
  
  @mobx.observable
  movies?: Array<app.MovieViewModel>;

  @mobx.observable
  title?: string;
}
