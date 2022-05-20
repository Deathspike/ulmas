import * as api from 'api';
import * as mobx from 'mobx';

export class SeriesViewModel {
  constructor(
    private readonly series: api.models.SeriesEntry) {
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
    return encodeURIComponent(this.series.id);
  }
}
