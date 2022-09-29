import * as api from 'api';
import * as app from '.';

export function createFilter(menu: app.MainViewModel) {
  const search = menu.search.debounceValue
    .toLowerCase()
    .split(' ');
  return (source: api.models.MovieEntry | api.models.SeriesEntry) => {
    const title = source.title.toLowerCase();
    return search.every(x => title.includes(x)) && api.filterBy(source, menu.filter.value);
  };
}

export function createSort(menu: app.MainViewModel) {
  return (a: api.models.MovieEntry | api.models.SeriesEntry, b: api.models.MovieEntry | api.models.SeriesEntry) => {
    return api.sortBy(a, b, menu.sort.value) * (menu.isAscending ? 1 : -1);
  };
}
