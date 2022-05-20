import * as app from '.';
import * as mobx from 'mobx';

export class SeriesViewModel {
  constructor(
    private readonly sectionId: string,
    private readonly resourceId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const series = await app.server.series.itemAsync(this.sectionId, this.resourceId);
    if (series.value) {
      this.source = series.value;
    } else if (series.statusCode === 404) {
      // Handle not found.
    } else {
      // Handle error.
    }
  }

  @mobx.computed
  get episodes() {
    return this.source?.episodes.map(x => new app.SeriesEpisodeViewModel(this.sectionId, this.resourceId, x)) ?? [];
  }

  @mobx.computed
  get posterUrl() {
    const poster = this.source?.images?.find(x => /[\\/]poster\.[^\.]+$/i.test(x.path));
    return poster && app.server.series.mediaUrl(this.sectionId, this.resourceId, poster.id);
  }

  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: app.api.models.Series = undefined;
}
