import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class PlayerViewModel {
  private readonly controller = new AbortController();

  constructor(private readonly sectionId: string, movie: api.models.Movie) {
    this.movie = movie;
    mobx.makeObservable(this);
  }

  @mobx.action
  close() {
    this.controller.abort();
    this.isActive = false;
  }

  @mobx.action
  continue() {
    return;
  }

  @mobx.action
  load() {
    const subtitleUrls = this.movie.media.subtitles
      ?.map(x => core.api.movies.mediaUrl(this.sectionId, this.movie.id, x.id)) ?? [];
    const videoUrl = this.movie.media.videos
      ?.map(x => core.api.movies.mediaUrl(this.sectionId, this.movie.id, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      this.state = 'playing';
      this.loadExternalPlayer(subtitleUrls, videoUrl);
    } else {
      this.state = 'error';
    }
  }

  @mobx.action
  async waitAsync() {
    await mobx.when(() => !this.isActive);
  }

  @mobx.computed
  get fanartUrl() {
    return core.image.movie(this.sectionId, this.movie, 'fanart');
  }

  @mobx.observable
  isActive = true;

  @mobx.observable
  movie: api.models.Movie;

  @mobx.observable
  state?: 'error' | 'playing';

  private loadExternalPlayer(subtitleUrls: Array<string>, videoUrl: string) {
    const position = this.movie.resume ? this.movie.resume.position : 0;
    const request = new api.models.MediaRequest({position, subtitleUrls, videoUrl});
    core.api.media.mpvAsync(request, this.controller.signal)
      .then(x => this.onComplete(x))
      .finally(() => window.postMessage('focus'));
  }

  private onComplete(resume: api.ServerResponse<api.models.MediaResume>) {
    if (!resume.status) {
      this.isActive = false;
    } else if (!resume.value || !resume.value.total) {
      this.state = 'error';
    } else if (resume.value.position / resume.value.total < 0.9) {
      core.api.movies.patchAsync(this.sectionId, this.movie.id, api.models.MoviePatch.create(resume.value));
      this.isActive = false;
    } else {
      core.api.movies.patchAsync(this.sectionId, this.movie.id, api.models.MoviePatch.create(true));
      this.isActive = false;
    }
  }
}
