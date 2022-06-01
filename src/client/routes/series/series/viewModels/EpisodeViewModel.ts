import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class EpisodeViewModel {
  constructor(private readonly onPlay: (vm: EpisodeViewModel) => void, sectionId: string, seriesId: string, source: api.models.Episode) {
    this.thumbUrl = core.image.episode(sectionId, seriesId, source, 'thumb');
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.action
  play() {
    this.onPlay(this);
  }

  @mobx.observable
  thumbUrl?: string;

  @mobx.observable
  source: api.models.Episode;
}
