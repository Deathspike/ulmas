import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class EpisodeViewModel {
  constructor(private readonly sectionId: string, private readonly seriesId: string, source: api.models.Episode) {
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.computed
  get thumbUrl() {
    return core.image.episode(this.sectionId, this.seriesId, this.source, 'thumb');
  }

  @mobx.observable
  source: api.models.Episode;
}
