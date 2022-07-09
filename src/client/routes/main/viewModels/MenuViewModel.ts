import * as app from '..';
import * as mobx from 'mobx';
import {DebounceSearch} from 'client/core';

export class MenuViewModel {
  constructor(private readonly mvm: app.MainViewModel, viewState?: app.ViewState) {
    this.search = new DebounceSearch(viewState?.search);
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    await this.mvm.refreshAsync();
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  @mobx.observable
  search: DebounceSearch;
}
