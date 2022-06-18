import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';
import {Debounce} from 'client/core';

export class MenuViewModel {
  constructor(private readonly mvm: app.MainViewModel, viewState?: app.ViewState) {
    this.search = new Debounce(viewState?.search);
    mobx.makeObservable(this);
  }

  @mobx.action
  changeSearch(search: string) {
    if (this.search.value === search) return;
    this.search.change(search);
    requestAnimationFrame(() => window.scrollTo(0, 0)); // THIS IS WRONG IN ALL MENUS
  }

  @mobx.action
  async refreshAsync() {
    await core.screen.waitAsync(async () => {
      await this.mvm.refreshAsync();
      requestAnimationFrame(() => window.scrollTo(0, 0));
    });
  }

  @mobx.observable
  search: Debounce;
}
