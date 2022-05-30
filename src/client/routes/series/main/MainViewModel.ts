import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor(
    private readonly sectionId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sectionsPromise = core.api.sections.readAsync();
    const seriesPromise = core.api.series.entriesAsync(this.sectionId);
    const sections = await sectionsPromise;
    const series = await seriesPromise;
    if (sections.value && series.value) {
      this.series = series.value;
      this.title = sections.value.find(x => x.id === this.sectionId)?.title;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get pages() {
    return createPages(this.series
      ?.slice()
      ?.sort((a, b) => a.dateEpisodeAdded && b.dateEpisodeAdded ? b.dateEpisodeAdded.localeCompare(a.dateEpisodeAdded) : 0));
  }
  
  @mobx.observable
  series?: Array<api.models.SeriesEntry>;

  @mobx.observable
  title?: string;
}

function createPages(series?: Array<api.models.SeriesEntry>) {
  const result = [];
  while (series?.length) result.push(series.splice(0, 24));
  return result;
}
