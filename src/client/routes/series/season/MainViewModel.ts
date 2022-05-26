import * as api from 'api';
import * as app from '.';
import * as core from 'client/core';
import * as mobx from 'mobx';
import {Service} from 'typedi';

@Service({transient: true})
export class MainViewModel {
  private readonly sectionId = this.routeService.get('sectionId');
  private readonly seriesId = this.routeService.get('seriesId');
  private readonly season = Number(this.routeService.get('season'));

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
      this.posterSrc = await app.imageAsync(this.mediaService.seriesImageUrl(series.value, app.getSeasonPoster(this.season), 'poster'));
      this.source = series.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get pages() {
    const episodes = this.source
      ?.episodes
      ?.filter(x => x.season === this.season);
    return createPages(episodes?.map(x => {
      const title = `${x.episode}. ${x.title}`;
      const thumbSrc = this.source && this.mediaService.episodeImageUrl(this.source, x, 'thumb');
      const url = encodeURIComponent(x.id);
      return new app.EpisodeViewModel(x.id, x.plot, thumbSrc, title, x.watched, url);
    }));
  }

  @mobx.computed
  get watched() {
    return Boolean(this.pages?.every(x => x.every(y => y.watched)));
  }
  
  @mobx.computed
  get seasonTitle() {
    return app.getSeasonTitle(this.season);
  }

  @mobx.computed
  get title() {
    return `${this.source?.title} - ${this.seasonTitle}`;
  }

  @mobx.observable
  posterSrc?: HTMLImageElement;

  @mobx.observable
  private source?: api.models.Series;
}

function createPages(episodes?: Array<app.EpisodeViewModel>) {
  const result: Array<Array<app.EpisodeViewModel>> = [];
  while (episodes?.length) result.push(episodes.splice(0, 4));
  return result;
}
