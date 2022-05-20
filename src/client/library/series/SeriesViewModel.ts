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
    const series = await app.server.series.detailAsync({sectionId: this.sectionId, resourceId: this.resourceId});
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
    // Media selection is really bad, but sufficient before the rework of the media access mechanism.
    const media = this.source?.media.find(x => x.path.includes('poster'));
    return media && app.server.series.mediaUrl({sectionId: this.sectionId, resourceId: this.resourceId, mediaId: media.id});
  }

  @mobx.computed
  get title() {
    return this.source?.title;
  }

  @mobx.observable
  private source?: app.api.models.Series = undefined;
}
