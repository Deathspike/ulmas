import * as app from '.';
import * as mobx from 'mobx';

export class SectionViewModel {
  constructor(
    private readonly sectionId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sectionId = this.sectionId;
    const section = await app.server.sections.sectionDetailAsync({sectionId});
    const series = await app.server.series.seriesListAsync({sectionId});
    if (section.value && series.value) {
      this.series = series.value.map(x => new app.SectionSeriesViewModel(x));
      this.title = section.value.title;
    } else {
      // Handle error.
    }
  }
  
  @mobx.observable
  series = new Array<app.SectionSeriesViewModel>();

  @mobx.observable
  title = '';
}
