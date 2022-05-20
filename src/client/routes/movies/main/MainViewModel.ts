import * as api from 'api';
import * as app from '.';
import * as mobx from 'mobx';
import {core} from '@/core';

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
      this.sectionsSource = sections.value;
      this.moviesSource = movies.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get movies() {
    return this.moviesSource
      ?.slice()
      ?.sort((a, b) => a.dateAdded && b.dateAdded ? b.dateAdded.localeCompare(a.dateAdded) : 0)
      ?.map(x => new app.MovieViewModel(x));
  }
  
  @mobx.computed
  get title() {
    return this.sectionsSource
      ?.find(x => x.id === this.sectionId)
      ?.title;
  }

  @mobx.observable
  private sectionsSource?: Array<api.models.Section>;
  
  @mobx.observable
  private moviesSource?: Array<api.models.MovieEntry>;
}
