import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MenuViewModel {
  constructor(private readonly mvm: app.MainViewModel, viewState?: app.ViewState) {
    this.filter = new app.LocalStorage('series.filter', 'all');
    this.order = new app.LocalStorage('series.order', 'descending');
    this.search = viewState?.search ?? '';
    this.sort = new app.LocalStorage('series.sort', 'dateEpisodeAdded');
    mobx.makeObservable(this);
  }

  @mobx.action
  changeFilter(filter: MenuViewModel['filter']['value']) {
    if (this.filter.value === filter) return;
    this.filter.change(filter);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  @mobx.action
  changeSearch(search: string) {
    if (this.search === search) return;
    this.search = search;
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  @mobx.action
  changeSort(sort: MenuViewModel['sort']['value']) {
    if (this.sort.value === sort) {
      this.order.change(this.ascending ? 'descending' : 'ascending')
      requestAnimationFrame(() => window.scrollTo(0, 0));
    } else if (sort === 'title') {
      this.order.change('ascending');
      this.sort.change(sort);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    } else {
      this.order.change('descending');
      this.sort.change(sort);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  }

  @mobx.action
  async refreshAsync() {
    await core.screen.waitAsync(async () => {
      await this.mvm.refreshAsync();
      requestAnimationFrame(() => window.scrollTo(0, 0));
    });
  }

  @mobx.computed
  get ascending() {
    return this.order.value === 'ascending';
  }
  
  @mobx.observable
  filter: app.LocalStorage<'all' | 'played' | 'unplayed'>;

  @mobx.observable
  order: app.LocalStorage<'ascending' | 'descending'>;

  @mobx.observable
  search: string;

  @mobx.observable
  sort: app.LocalStorage<'dateAdded' | 'dateEpisodeAdded' | 'lastPlayed' | 'premieredDate' | 'title'>;
}
