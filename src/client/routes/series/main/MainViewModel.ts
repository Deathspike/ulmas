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
    const seriesPromise = this.apiService.series.entriesAsync(this.sectionId);
    const sections = await sectionsPromise;
    const series = await seriesPromise;
    if (sections.value && series.value) {
      this.sectionsSource = sections.value;
      this.seriesSource = series.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get series() {
    return this.seriesSource
      ?.slice()
      ?.sort((a, b) => a.dateEpisodeAdded && b.dateEpisodeAdded ? b.dateEpisodeAdded.localeCompare(a.dateEpisodeAdded) : 0)
      ?.map(x => new app.SeriesViewModel(x));
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
  private seriesSource?: Array<api.models.SeriesEntry>;
}
