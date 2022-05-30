import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class PlayerViewModel {
  private readonly controller = new AbortController();
  private readonly episodes: Array<api.models.Episode>;
  private readonly sectionId: string;
  private counterCallback?: Function;
  private counterInterval?: NodeJS.Timeout;

  constructor(sectionId: string, series: api.models.Series, episodes: Array<api.models.Episode>, episode: api.models.Episode) {
    this.sectionId = sectionId;
    this.series = series;
    this.episodes = episodes;
    this.episode = episode;
    mobx.makeObservable(this);
  }

  @mobx.action
  close() {
    this.controller.abort();
    this.isActive = false;
    this.stopCounter();
  }

  @mobx.action
  continue() {
    this.counterCallback?.();
    this.stopCounter();
  }

  @mobx.action
  load() {
    const subtitleUrls = this.episode.media.subtitles
      ?.map(x => core.api.series.mediaUrl(this.sectionId, this.series.id, x.id)) ?? [];
    const videoUrl = this.episode.media.videos
      ?.map(x => core.api.series.mediaUrl(this.sectionId, this.series.id, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      this.loadExternalPlayer(subtitleUrls, videoUrl);
      this.state = 'playing';
    } else {
      this.onError();
    }
  }

  @mobx.observable
  counter?: number;

  @mobx.observable
  episode: api.models.Episode;

  @mobx.observable
  isActive = true;

  @mobx.observable
  series: api.models.Series;

  @mobx.observable
  state?: 'error' | 'pending' | 'playing';

  private loadExternalPlayer(subtitleUrls: Array<string>, videoUrl: string) {
    const position = this.episode.resume ? this.episode.resume.position : 0;
    const request = new api.models.MediaRequest({position, subtitleUrls, videoUrl});
    core.api.media.mpvAsync(request, this.controller.signal).then(x => this.onComplete(x));
  }

  private moveToNext() {
    const nextIndex = this.episodes.indexOf(this.episode) + 1;
    if (nextIndex < this.episodes.length) {
      this.episode = this.episodes[nextIndex];
      return true;
    } else {
      this.isActive = false;
      return false;
    }
  }

  private onComplete(resume: api.ServerResponse<api.models.MediaResume>) {
    if (!resume.status) {
      this.isActive = false;
    } else if (!resume.value || !resume.value.total) {
      this.onError();
    } else if (resume.value.position / resume.value.total < 0.9) {
      // TODO: Save progress.
      this.isActive = false;
    } else {
      // TODO: Save watched.
      if (!this.moveToNext()) return;
      this.state = 'pending';
      this.startCounter(() => this.load());
    }
  }

  private onError() {
    this.state = 'error';
    this.startCounter(() => this.moveToNext() && this.load());
  }

  private startCounter(callback: Function) {
    this.stopCounter();
    this.counter = 100;
    this.counterCallback = callback;
    this.counterInterval = setInterval(() => {
      if (!this.counter) this.continue();
      else this.counter--;
    }, 150);
  }
  
  private stopCounter() {
    if (!this.counterInterval) return;
    clearInterval(this.counterInterval);
    delete this.counterCallback;
    delete this.counterInterval;
  }
}
