import * as api from 'api';
import * as core from 'client/core';
import * as mobx from 'mobx';
import {Service} from 'typedi';

@Service({transient: true})
export class MainViewModel {
  private readonly abortController = new AbortController();
  private readonly sectionId = this.routeService.get('sectionId');
  private readonly movieId = this.routeService.get('movieId');

  constructor(
    private readonly apiService: core.ApiService,
    private readonly routeService: core.RouteService) {
    mobx.makeObservable(this);
  }

  @mobx.action
  componentDidMount() {
    const subtitleUrls = this.source?.media.subtitles
      ?.map(x => this.apiService.movies.mediaUrl(this.sectionId, this.movieId, x.id)) ?? [];
    const videoUrl = this.source?.media.videos
      ?.map(x => this.apiService.movies.mediaUrl(this.sectionId, this.movieId, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      // TODO: Handle finished.
      const position = this.source?.resume?.position ?? 0;
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
    const movie = await this.apiService.movies.itemAsync(this.sectionId, this.movieId);
    if (movie.value) {
      this.source = movie.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: api.models.Movie;
}
