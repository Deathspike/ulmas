import * as api from 'api';
import * as mobx from 'mobx';
import * as routes from 'client/routes';
import {core} from 'client/core';

export class SeriesViewModel {
  constructor(private readonly sectionId: string, source: api.models.SeriesEntry) {
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.action
  open() {
    routes.series.series(this.sectionId, this.source.id);
  }

  @mobx.computed
  get posterUrl() {
    return core.image.series(this.sectionId, this.source, 'poster');
  }

  @mobx.observable
  source: api.models.SeriesEntry;
}
