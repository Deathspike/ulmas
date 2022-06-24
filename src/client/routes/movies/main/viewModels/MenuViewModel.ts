import * as app from '..';
import * as mobx from 'mobx';
import {DebounceSearch} from 'client/core';
import {LocalStorage} from 'client/core';

export class MenuViewModel {
  constructor(private readonly mvm: app.MainViewModel, viewState?: app.ViewState) {
    this.filter = new LocalStorage('movies.filter', 'all');
    this.order = new LocalStorage('movies.order', 'descending');
    this.search = new DebounceSearch(viewState?.search);
    this.sort = new LocalStorage('movies.sort', 'dateAdded');
    mobx.makeObservable(this);
  }

  @mobx.action
  changeFilter(filter: MenuViewModel['filter']['value']) {
    if (this.filter.value === filter) return;
    this.filter.change(filter);
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
    await this.mvm.refreshAsync();
  }

  @mobx.computed
  get ascending() {
    return this.order.value === 'ascending';
  }
  
  @mobx.observable
  filter: LocalStorage<'all' | 'played' | 'unplayed'>;

  @mobx.observable
  order: LocalStorage<'ascending' | 'descending'>;

  @mobx.observable
  search: DebounceSearch;

  @mobx.observable
  sort: LocalStorage<'dateAdded' | 'lastPlayed' | 'premieredDate' | 'title'>;
}
