import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string) {
    mobx.makeObservable(this);
  }
  
  @mobx.action
  handleKey(keyName: string) {
    if (keyName === 'enter' || keyName === 'space') {
      this.currentPlayer?.continue();
      return true;
    } else if (keyName === 'escape') {
      this.onBack();
      return true;
    } else {
      return false;
    }
  }

  @mobx.action
  onBack() {
    if (this.currentPlayer?.isActive) {
      this.currentPlayer.close();
    } else {
      core.screen.backAsync();
    }
  }

  @mobx.action
  async refreshAsync() {
    // TODO: Handle section not found.
    const sectionsPromise = core.api.sections.readAsync();
    const seriesPromise = core.api.series.entriesAsync(this.sectionId);
    const sections = await sectionsPromise;
    const series = await seriesPromise;
    if (sections.value && series.value) {
      this.series = series.value.map(x => new app.SeriesViewModel(this, this.sectionId, x));
      this.title = sections.value.find(x => x.id === this.sectionId)?.title;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.action
  async playAsync(series: api.models.Series) {
    if (this.currentPlayer?.isActive) {
      this.currentPlayer.continue();
      await this.currentPlayer.waitAsync();
    } else {
      this.currentPlayer = new app.core.PlayerViewModel(this.sectionId, series.id, series.episodes);
      this.currentPlayer.load();
      await this.currentPlayer.waitAsync();
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
  currentPlayer?: app.core.PlayerViewModel;

  @mobx.observable
  series?: Array<app.SeriesViewModel>;

  @mobx.observable
  title?: string;
}
