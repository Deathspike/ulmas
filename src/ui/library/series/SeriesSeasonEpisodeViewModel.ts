import * as app from '.';
import * as mobx from 'mobx';

export class SeriesSeasonEpisodeViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly seriesId: string,
    private readonly episode: app.api.models.SeriesSeasonEpisode) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.episode.id;
  }

  @mobx.computed
  get title() {
    const number = String(this.episode.number).padStart(2, '0');
    const suffix = this.episode.title && ` - ${this.episode.title}`;
    return number + suffix;
  }

  @mobx.computed
  get url() {
    const sectionId = this.sectionId;
    const seriesId = this.seriesId;
    const episodeId = this.episode.id;
    return app.server.series.episodeVideoUrl({sectionId, seriesId, episodeId});
  }
}
