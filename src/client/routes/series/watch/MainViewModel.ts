import * as api from 'api';
import * as core from 'client/core';
import * as mobx from 'mobx';
import {Service} from 'typedi';

@Service({transient: true})
export class MainViewModel {
  private readonly abortController = new AbortController();
  private readonly sectionId = this.routeService.get('sectionId');
  private readonly seriesId = this.routeService.get('seriesId');
  private readonly episodeId = this.routeService.get('episodeId');

  constructor(
    private readonly apiService: core.ApiService,
    private readonly routeService: core.RouteService) {
    mobx.makeObservable(this);
  }

  @mobx.action
  componentDidMount() {
    const episode = this.source?.episodes
      .find(x => x.id === this.episodeId);
    const subtitleUrls = episode?.media.subtitles
      ?.map(x => this.apiService.series.mediaUrl(this.sectionId, this.seriesId, x.id)) ?? [];
    const videoUrl = episode?.media.videos
      ?.map(x => this.apiService.series.mediaUrl(this.sectionId, this.seriesId, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      // TODO: Handle finished.
      const position = episode?.resume?.position ?? 0;
      const request = new api.models.MediaRequest({position, subtitleUrls, videoUrl});
      this.apiService.media.mpvAsync(request, this.abortController.signal);
    } else {
      // TODO: Handle no video.
    }
  }

  @mobx.action
  componentWillUnmount() {
    this.abortController.abort();
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
  get title() {
    return this.source
      ?.episodes.find(x => x.id === this.episodeId)
      ?.title;
  }

  @mobx.observable
  private source?: api.models.Series;
}
