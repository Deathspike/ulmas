import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

// TODO: Handle cancellation. If we navigate away, mpv should stop (trying to) play.
export class MainViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly seriesId: string,
    private readonly episodeId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  componentDidMount() {
    const episode = this.source?.episodes
      .find(x => x.id === this.episodeId);
    const subtitleUrls = episode?.media.subtitles
      ?.map(x => core.api.series.mediaUrl(this.sectionId, this.seriesId, x.id)) ?? [];
    const videoUrl = episode?.media.videos
      ?.map(x => core.api.series.mediaUrl(this.sectionId, this.seriesId, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      // TODO: Handle finished.
      const position = episode?.resume?.position ?? 0;
      core.api.media.mpvAsync(new api.models.MediaRequest({position, subtitleUrls, videoUrl}));
    } else {
      // TODO: Handle no video.
    }
  }
  
  @mobx.action
  async refreshAsync() {
    const series = await core.api.series.itemAsync(this.sectionId, this.seriesId);
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
