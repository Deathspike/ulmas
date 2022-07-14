import * as app from '..';
import * as mobx from 'mobx';
import {LocalStorage} from 'client/core';

export class MainViewModel {
  constructor(private readonly controller: app.IController) {
    this.filter = new LocalStorage('menu.filter', 'all');
    this.order = new LocalStorage('menu.order', 'descending');
    this.search = new app.SearchViewModel('menu.search');
    this.sort = new LocalStorage('menu.sort', 'dateAdded');
    mobx.makeObservable(this);
  }

  @mobx.action
  changeFilter(filter: MainViewModel['filter']['value']) {
    if (this.filter.value === filter) return;
    this.filter.change(filter);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  @mobx.action
  changeSort(sort: MainViewModel['sort']['value']) {
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
    await this.controller.refreshAsync();
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  @mobx.computed
  get ascending() {
    return this.order.value === 'ascending';
  }
  
  @mobx.observable
  filter: LocalStorage<'all' | 'ended' | 'ongoing' | 'unseen'>;

  @mobx.observable
  order: LocalStorage<'ascending' | 'descending'>;

  @mobx.observable
  search: app.SearchViewModel;

  @mobx.observable
  sort: LocalStorage<'dateAdded' | 'lastPlayed' | 'premieredDate' | 'title'>;
}
