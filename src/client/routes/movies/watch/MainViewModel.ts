import * as api from 'api';
import * as mobx from 'mobx';
import {core} from '@/core';

// TODO: Handle cancellation. If we navigate away, mpv should stop (trying to) play.
export class MainViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly movieId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  componentDidMount() {
    const subtitleUrls = this.source?.media.subtitles
      ?.map(x => core.api.movies.mediaUrl(this.sectionId, this.movieId, x.id)) ?? [];
    const videoUrl = this.source?.media.videos
      ?.map(x => core.api.movies.mediaUrl(this.sectionId, this.movieId, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      // TODO: Handle finished.
      const position = this.source?.resume?.position ?? 0;
      core.api.media.mpvAsync(new api.models.MediaRequest({position, subtitleUrls, videoUrl}));
    } else {
      // TODO: Handle no video.
    }
  }
  
  @mobx.action
  async refreshAsync() {
    const movie = await core.api.movies.itemAsync(this.sectionId, this.movieId);
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
