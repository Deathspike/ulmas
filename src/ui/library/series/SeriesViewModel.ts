import * as app from '.';
import * as mobx from 'mobx';

export class SeriesViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly seriesId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sectionId = this.sectionId;
    const seriesId = this.seriesId;
    const series = await app.server.series.seriesDetailAsync({sectionId, seriesId});
    if (series.value) {
      this.seasons = series.value.seasons.map(x => new app.SeriesSeasonViewModel(this.sectionId, this.seriesId, x));
      this.title = series.value.title;
    } else if (series.statusCode === 404) {
      // Handle not found.
    } else {
      // Handle error.
    }
  }

  @mobx.observable
  seasons = new Array<app.SeriesSeasonViewModel>();

  @mobx.observable
  title = '';
}
