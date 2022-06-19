import * as api from 'api';
import * as app from '.';

export function createFilter(menu: app.MenuViewModel) {
  const search = menu.search.debounceValue
    .toLowerCase()
    .split(' ');
  return (a: api.models.MovieEntry) => {
    const title = a.title.toLowerCase();
    return search.every(x => title.includes(x)) && filterBy(a, menu.filter.value);
  };
}

export function createSort(menu: app.MenuViewModel) {
  return (a: api.models.MovieEntry, b: api.models.MovieEntry) => {
    return api.sortBy(a, b, menu.sort.value);
  };
}

function filterBy(a: api.models.MovieEntry, filter: app.MenuViewModel['filter']['value']) {
  switch (filter) {
    case 'all':
      return true;
    case 'played':
      return Boolean(a.watched);
    case 'unplayed':
      return !Boolean(a.watched);
    default:
      throw new Error();
  }
}
