import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {LocalStorage} from 'client/core';

export class MainViewModel {
  constructor(private readonly controller: app.IController, private readonly shouldResetScroll: boolean = false) {
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
    this.tryResetScroll();
  }

  @mobx.action
  changeSort(sort: MainViewModel['sort']['value']) {
    if (this.sort.value === sort) {
      this.order.change(this.isAscending ? 'descending' : 'ascending')
      this.tryResetScroll();
    } else if (sort === 'title') {
      this.order.change('ascending');
      this.sort.change(sort);
      this.tryResetScroll();
    } else {
      this.order.change('descending');
      this.sort.change(sort);
      this.tryResetScroll();
    }
  }
  
  @mobx.action
  async scanAsync() {
    await this.controller.scanAsync();
  }

  @mobx.computed
  get isAscending() {
    return this.order.value === 'ascending';
  }
  
  @mobx.computed
  get isScanning() {
    return this.controller.isScanning;
  }

  @mobx.observable
  filter: LocalStorage<api.FilterType>;

  @mobx.observable
  order: LocalStorage<'ascending' | 'descending'>;

  @mobx.observable
  search: app.SearchViewModel;

  @mobx.observable
  sort: LocalStorage<api.SortType>;

  private tryResetScroll() {
    if (!this.shouldResetScroll) return;
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }
}
