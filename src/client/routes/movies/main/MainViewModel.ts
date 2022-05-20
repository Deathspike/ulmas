import * as api from 'api';
import * as app from '.';
import * as core from 'client/core';
import * as mobx from 'mobx';
import {Service} from 'typedi';

@Service({transient: true})
export class MainViewModel {
  private readonly sectionId = this.routeService.get('sectionId');

  constructor(
    private readonly apiService: core.ApiService,
    private readonly routeService: core.RouteService) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sectionsPromise = this.apiService.sections.readAsync();
    const moviesPromise = this.apiService.movies.entriesAsync(this.sectionId);
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
      ?.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
      ?.map(x => new app.MovieViewModel(x.id, x.title));
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
