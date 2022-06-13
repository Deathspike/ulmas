import * as api from 'api';
import * as app from '.';

export function createFilter(menu: app.MenuViewModel) {
  const search = menu.search
    .toLowerCase()
    .split(' ');
  return (a: api.models.MovieEntry) => {
    const title = a.title.toLowerCase();
    return search.every(x => title.includes(x)) && filterBy(a, menu.filter.value);
  };
}

export function createSort(menu: app.MenuViewModel) {
  return (a: api.models.MovieEntry, b: api.models.MovieEntry) => {
    switch (menu.sort.value) {
      case 'dateAdded':
        return a.dateAdded.localeCompare(b.dateAdded);
      case 'lastPlayed':
        if (a.lastPlayed && b.lastPlayed) return a.lastPlayed.localeCompare(b.lastPlayed);
        if (a.lastPlayed || b.lastPlayed) return a.lastPlayed ? 1 : -1;
        return a.dateAdded.localeCompare(b.dateAdded);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        throw new Error();
    }
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
