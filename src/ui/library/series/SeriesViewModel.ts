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
      this.episodes = series.value.episodes.map(x => new app.SeriesEpisodeViewModel(this.sectionId, this.resourceId, x));
      this.title = series.value.title;
    } else if (series.statusCode === 404) {
      // Handle not found.
    } else {
      // Handle error.
    }
  }

  @mobx.observable
  episodes = new Array<app.SeriesEpisodeViewModel>();

  @mobx.observable
  title = '';
}
