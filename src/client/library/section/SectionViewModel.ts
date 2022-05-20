import * as app from '.';
import * as mobx from 'mobx';

export class SectionViewModel {
  constructor(
    private readonly sectionId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sectionList = await app.server.sections.readAsync();
    const section = sectionList.value?.find(x => x.id === this.sectionId);
    const series = await app.server.series.entriesAsync(this.sectionId);
    if (section && series.value) {
      this.series = series.value
        .sort((a, b) => a.dateEpisodeAdded && b.dateEpisodeAdded ? b.dateEpisodeAdded.localeCompare(a.dateEpisodeAdded) : 0)
        .map(x => new app.SectionSeriesViewModel(x));
      this.title = section.title;
    } else {
      // Handle error.
    }
  }
  
  @mobx.observable
  series = new Array<app.SectionSeriesViewModel>();

  @mobx.observable
  title = '';
}
