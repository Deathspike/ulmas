import * as app from '.';
import * as mobx from 'mobx';

export class SeriesSeasonViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly seriesId: string,
    private readonly season: app.api.models.SeriesSeason) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.season.id;
  }
  
  @mobx.computed
  get episodes() {
    return this.season.episodes.map(x => new app.SeriesSeasonEpisodeViewModel(this.sectionId, this.seriesId, x));
  }

  @mobx.computed
  get title() {
    return this.season.title;
  }
}
