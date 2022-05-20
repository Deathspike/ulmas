import * as app from '.';
import * as mobx from 'mobx';

export class SeriesEpisodeViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly resourceId: string,
    private readonly episode: app.api.models.SeriesEpisode) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async openAsync() {
    const subtitleUrls = this.episode.media.subtitles
      ?.map(x => app.server.series.mediaUrl(this.sectionId, this.resourceId, x.id)) ?? [];
    const videoUrl = this.episode.media.videos
      ?.map(x => app.server.series.mediaUrl(this.sectionId, this.resourceId, x.id))
      ?.find(Boolean);
    if (videoUrl) {
      const position = 0;
      await app.server.media.mpvAsync(new app.api.models.MediaRequest({position, subtitleUrls, videoUrl}));
    }
  }

  @mobx.computed
  get title() {
    const episode = String(this.episode.episode).padStart(2, '0');
    const season = String(this.episode.season).padStart(2, '0');
    return `${season}x${episode} ${this.episode.title}`;
  }
}
