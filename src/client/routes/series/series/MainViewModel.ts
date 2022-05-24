import * as api from 'api'
import * as app from '.';
import * as core from 'client/core';
import * as mobx from 'mobx';
import {language} from './language';
import {Service} from 'typedi';

@Service({transient: true})
export class MainViewModel {
  private readonly sectionId = this.routeService.get('sectionId');
  private readonly seriesId = this.routeService.get('seriesId');

  constructor(
    private readonly apiService: core.ApiService,
    private readonly mediaService: core.MediaService,
    private readonly routeService: core.RouteService) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const series = await this.apiService.series.itemAsync(this.sectionId, this.seriesId);
    if (series.value) {
      this.source = series.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get hasEpisodes() {
    return Boolean(this.source?.episodes.length);
  }

  @mobx.computed
  get hasWatchedAll() {
    return Boolean(this.source?.episodes.every(x => x.watched));
  }

  @mobx.computed
  get posterUrl() {
    return this.source
      ? this.mediaService.seriesImageUrl(this.source, ['poster'])
      : undefined;
  }

  @mobx.computed
  get plot() {
    return this.source?.plot;
  }

  @mobx.computed
  get seasons() {
    const seasons = Array.from(new Set(this.source
      ?.episodes
      ?.map(x => x.season)));
    return seasons.map(x => {
      const posterUrl = this.source && this.mediaService.seriesImageUrl(this.source, [app.getSeasonPoster(x), 'poster']);
      const title = app.getSeasonTitle(x);
      const url = encodeURIComponent(x);
      return new app.SeasonViewModel(String(x), posterUrl, title, url);
    });
  }
  
  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: api.models.Series;
}
