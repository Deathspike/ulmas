import * as app from '.';
import * as mobx from 'mobx';

export class SectionSeriesViewModel {
  constructor(
    private readonly series: app.api.models.SeriesListItem) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.series.id;
  }

  @mobx.computed
  get title() {
    return this.series.title;
  }

  @mobx.computed
  get url() {
    return this.series.id + '/';
  }
}
