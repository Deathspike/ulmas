import * as app from '..';
import * as mobx from 'mobx';

export class MenuViewModel {
  constructor(private readonly controller: app.IController) {
    this.filter = new app.LocalStorage('menu.filter', 'all');
    this.order = new app.LocalStorage('menu.order', 'descending');
    this.search = new app.DebounceSearch('menu.search');
    this.sort = new app.LocalStorage('menu.sort', 'dateAdded');
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
    await this.controller.refreshAsync();
    requestAnimationFrame(() => window.scrollTo(0, 0));
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
  search: app.DebounceSearch;

  @mobx.observable
  sort: app.LocalStorage<'dateAdded' | 'lastPlayed' | 'premieredDate' | 'title'>;
}
