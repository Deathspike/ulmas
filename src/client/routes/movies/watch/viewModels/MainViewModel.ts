import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  private readonly abortController = new AbortController();

  constructor(private readonly sectionId: string, private readonly movieId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  onBack() {
    core.screen.backAsync();
    this.abortController.abort();
  }

  @mobx.action
  load() {
    const subtitleUrls = this.media?.subtitles
      ?.map(x => core.api.movies.mediaUrl(this.sectionId, this.movieId, x.id)) ?? [];
    const videoUrl = this.media?.videos
      ?.map(x => core.api.movies.mediaUrl(this.sectionId, this.movieId, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      // TODO: Handle finished.
      const position = this.resumePosition ?? 0;
      const request = new api.models.MediaRequest({position, subtitleUrls, videoUrl});
      core.api.media.mpvAsync(request, this.abortController.signal);
    } else {
      // TODO: Handle no video.
    }
  }
  
  @mobx.action
  async refreshAsync() {
    const movie = await core.api.movies.itemAsync(this.sectionId, this.movieId);
    if (movie.value) {
      this.media = movie.value.media;
      this.title = movie.value.title;
      this.resumePosition = movie.value.resume?.position;
      this.load();
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.observable
  media?: api.models.Media;

  @mobx.observable
  title?: string;

  @mobx.observable
  resumePosition?: number;
}
