import * as api from 'api'
import * as app from '.';
import * as mobx from 'mobx';
import {core} from '@/core';

export class MainViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly seriesId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const series = await core.api.series.itemAsync(this.sectionId, this.seriesId);
    if (series.value) {
      this.source = series.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get episodes() {
    return this.source
      ?.episodes
      ?.map(x => new app.EpisodeViewModel(x));
  }

  @mobx.computed
  get posterUrl() {
    const image = this.source
      ?.images
      ?.find(x => /[\\/]poster\.[^\.]+$/i.test(x.path));
    return image
      ? core.api.series.mediaUrl(this.sectionId, this.seriesId, image.id)
      : undefined;
  }

  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: api.models.Series;
}
