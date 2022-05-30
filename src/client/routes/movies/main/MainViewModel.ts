import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(
    private readonly sectionId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sectionsPromise = core.api.sections.readAsync();
    const moviesPromise = core.api.movies.entriesAsync(this.sectionId);
    const sections = await sectionsPromise;
    const movies = await moviesPromise;
    if (sections.value && movies.value) {
      this.movies = movies.value;
      this.title = sections.value.find(x => x.id === this.sectionId)?.title;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get pages() {
    return createPages(this.movies
      ?.slice()
      ?.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)));
  }
  
  @mobx.observable
  movies?: Array<api.models.MovieEntry>;

  @mobx.observable
  title?: string;
}

function createPages(movies?: Array<api.models.MovieEntry>) {
  const result = [];
  while (movies?.length) result.push(movies.splice(0, 24));
  return result;
}
