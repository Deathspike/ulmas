import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class PlayerViewModel {
  private readonly controller = new AbortController();
  private readonly episodes: Array<api.models.Episode>;
  private counterCallback?: () => void;
  private counterInterval?: NodeJS.Timeout;

  constructor(private readonly sectionId: string, private readonly seriesId: string, episodes: Array<api.models.Episode>, current?: api.models.Episode) {
    this.episodes = episodes
      .slice()
      .sort((a, b) => a.season - b.season || a.episode - b.episode);
    this.current = current
      ?? this.episodes.find(x => x.season && !x.watched)
      ?? this.episodes.find(x => !x.watched)
      ?? this.episodes.find(x => x.season)
      ?? this.episodes[0];
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
    const subtitleUrls = this.current.media.subtitles
      ?.map(x => core.api.series.mediaUrl(this.sectionId, this.seriesId, x.id)) ?? [];
    const videoUrl = this.current.media.videos
      ?.map(x => core.api.series.mediaUrl(this.sectionId, this.seriesId, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      this.state = 'playing';
      this.loadExternalPlayer(subtitleUrls, videoUrl);
    } else {
      this.state = 'error';
      this.startCounter(() => this.moveToNext() && this.load());
    }
  }

  @mobx.action
  async waitAsync() {
    await mobx.when(() => !this.isActive);
  }

  @mobx.computed
  get thumbUrl() {
    return core.image.episode(this.sectionId, this.seriesId, this.current, 'thumb');
  }

  @mobx.observable
  counter?: number;

  @mobx.observable
  current: api.models.Episode;

  @mobx.observable
  isActive = true;

  @mobx.observable
  state?: 'error' | 'pending' | 'playing';

  private loadExternalPlayer(subtitleUrls: Array<string>, videoUrl: string) {
    const position = this.current.resume ? this.current.resume.position : 0;
    const request = new api.models.MediaRequest({position, subtitleUrls, videoUrl});
    core.api.media.mpvAsync(request, this.controller.signal).then(x => this.onCompleteAsync(x));
  }

  private moveToNext() {
    const index = this.episodes.findIndex(x => x.id === this.current.id);
    const nextIndex = index + 1;
    if (nextIndex < this.episodes.length) {
      this.current = this.episodes[nextIndex];
      return true;
    } else {
      this.isActive = false;
      return false;
    }
  }

  private async onCompleteAsync(resume: api.ServerResponse<api.models.MediaResume>) {
    if (!resume.status) {
      this.isActive = false;
    } else if (!resume.value || !resume.value.total) {
      this.state = 'error';
      this.startCounter(() => this.moveToNext() && this.load());
    } else if (resume.value.position / resume.value.total < 0.9) {
      await app.resumeAsync(this.sectionId, this.seriesId, [this.current], resume.value);
      this.isActive = false;
    } else {
      await app.watchedAsync(this.sectionId, this.seriesId, [this.current], true);
      if (!this.moveToNext()) return;
      this.state = 'pending';
      this.startCounter(() => this.load());
    }
  }

  private startCounter(callback: () => void) {
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
