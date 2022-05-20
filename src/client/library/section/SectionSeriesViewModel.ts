import * as app from '.';
import * as mobx from 'mobx';

export class SectionSeriesViewModel {
  constructor(
    private readonly series: app.api.models.SeriesEntry) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.series.id;
  }

  @mobx.computed
  get title() {
    return `${this.series.title} (${this.series.unwatchedCount ?? 0})`;
  }

  @mobx.computed
  get url() {
    return this.series.id + '/';
  }
}
