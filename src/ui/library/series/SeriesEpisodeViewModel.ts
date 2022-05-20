import * as app from '.';
import * as mobx from 'mobx';

export class SeriesEpisodeViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly seriesId: string,
    private readonly episode: app.api.models.SeriesEpisode) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.episode.id;
  }

  @mobx.computed
  get title() {
    const episode = String(this.episode.episode).padStart(2, '0');
    const season = String(this.episode.season).padStart(2, '0');
    return `${season}x${episode} ${this.episode.title}`;
  }

  @mobx.computed
  get url() {
    const sectionId = this.sectionId;
    const seriesId = this.seriesId;
    const episodeId = this.episode.id;
    return app.server.series.episodeVideoUrl({sectionId, seriesId, episodeId});
  }
}
