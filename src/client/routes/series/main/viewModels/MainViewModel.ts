import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class MainViewModel {
  constructor(private readonly sectionId: string, viewState?: app.ViewState) {
    this.menu = new app.MenuViewModel(this, viewState);
    mobx.makeObservable(this);
  }
  
  @mobx.action
  handleKey(keyName: string) {
    if (keyName.startsWith('arrow')) {
      return Boolean(this.currentPlayer?.isActive);
    } else if (keyName === 'enter' || keyName === 'space') {
      this.currentPlayer?.continue();
      return true;
    } else if (keyName === 'escape' && this.menu.search) {
      this.menu.changeSearch();
      return true;
    } else if (keyName === 'escape') {
      this.onBackAsync();
      return true;
    } else {
      return false;
    }
  }

  @mobx.action
  async onBackAsync() {
    if (this.currentPlayer?.isActive) {
      this.currentPlayer.close();
    } else {
      await core.screen.backAsync();
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
      this.source = series.value;
      this.title = sections.value.find(x => x.id === this.sectionId)?.title;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.action
  async playAsync(series: api.models.Series) {
    this.currentPlayer = new app.core.PlayerViewModel(this.sectionId, series.id, series.episodes);
    this.currentPlayer.load();
    await this.currentPlayer.waitAsync();
  }

  @mobx.computed
  get pages() {
    if (!this.source) return;
    const series = this.source
      .filter(app.createFilter(this.menu))
      .sort(app.createSort(this.menu))
      .map(x => new app.SeriesViewModel(this, this.sectionId, x));
    return Array.from(ui.createPages(24, this.menu.ascending
      ? series
      : series.reverse()));
  }

  @mobx.computed
  get viewState() {
    return new app.ViewState(this.menu.search);
  }
  
  @mobx.observable
  currentPlayer?: app.core.PlayerViewModel;

  @mobx.observable
  menu: app.MenuViewModel;
  
  @mobx.observable
  source?: Array<api.models.SeriesEntry>;

  @mobx.observable
  title?: string;
}
