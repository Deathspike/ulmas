import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';
import {Debounce} from 'client/core';
import {LocalStorage} from 'client/core';

export class MenuViewModel {
  constructor(private readonly mvm: app.MainViewModel, viewState?: app.ViewState) {
    this.filter = new LocalStorage('series.filter', 'all');
    this.order = new LocalStorage('series.order', 'descending');
    this.search = new Debounce(viewState?.search);
    this.sort = new LocalStorage('series.sort', 'dateEpisodeAdded');
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
    if (this.search.value === search) return;
    this.search.change(search);
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
  filter: LocalStorage<'all' | 'played' | 'unplayed'>;

  @mobx.observable
  order: LocalStorage<'ascending' | 'descending'>;

  @mobx.observable
  search: Debounce;

  @mobx.observable
  sort: LocalStorage<'dateAdded' | 'dateEpisodeAdded' | 'lastPlayed' | 'premieredDate' | 'title'>;
}
