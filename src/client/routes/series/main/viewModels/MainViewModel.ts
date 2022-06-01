import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    // TODO: Handle section not found.
    const sectionsPromise = core.api.sections.readAsync();
    const seriesPromise = core.api.series.entriesAsync(this.sectionId);
    const sections = await sectionsPromise;
    const series = await seriesPromise;
    if (sections.value && series.value) {
      this.series = series.value.map(x => new app.SeriesViewModel(this.sectionId, x));
      this.title = sections.value.find(x => x.id === this.sectionId)?.title;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get pages() {
    if (!this.series) return;
    return Array.from(ui.createPages(24, this.series.slice().sort((a, b) => {
      const ax = a.source.dateEpisodeAdded ?? a.source.dateAdded;
      const bx = b.source.dateEpisodeAdded ?? b.source.dateAdded;
      return bx.localeCompare(ax);
    })));
  }
  
  @mobx.observable
  series?: Array<app.SeriesViewModel>;

  @mobx.observable
  title?: string;
}
