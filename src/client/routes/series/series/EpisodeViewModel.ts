import * as api from 'api';
import * as mobx from 'mobx';

export class EpisodeViewModel {
  constructor(
    private readonly episode: api.models.Episode) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.episode.id;
  }

  @mobx.computed
  get title() {
    return this.episode.title;
  }
  
  @mobx.computed
  get url() {
    return `${encodeURIComponent(this.episode.id)}/watch`;
  }
}
