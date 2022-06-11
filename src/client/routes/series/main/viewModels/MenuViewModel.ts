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
    this.filter.change(filter);
  }

  @mobx.action
  changeSearch(search: string) {
    this.search = search;
  }

  @mobx.action
  changeSort(sort: MenuViewModel['sort']['value']) {
    if (this.sort.value === sort) {
      this.order.change(this.ascending ? 'descending' : 'ascending')
    } else if (sort === 'title') {
      this.order.change('ascending');
      this.sort.change(sort);
    } else {
      this.order.change('descending');
      this.sort.change(sort);
    }
  }

  @mobx.action
  async refreshAsync() {
    await core.screen.waitAsync(() => this.mvm.refreshAsync());
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
