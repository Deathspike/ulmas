import * as api from 'api';
import * as app from '.';

export function createFilter(menu: app.MenuViewModel) {
  const search = menu.search.debounceValue
    .toLowerCase()
    .split(' ');
  return (a: api.models.SeriesEntry) => {
    const title = a.title.toLowerCase();
    return search.every(x => title.includes(x)) && filterBy(a, menu.filter.value);
  };
}

export function createSort(menu: app.MenuViewModel) {
  return (a: api.models.SeriesEntry, b: api.models.SeriesEntry) => {
    return sortBy(a, b, menu.sort.value);
  };
}

function filterBy(a: api.models.SeriesEntry, filter: app.MenuViewModel['filter']['value']) {
  switch (filter) {
    case 'all':
      return true;
    case 'played':
      return !Boolean(a.unwatchedCount);
    case 'unplayed':
      return Boolean(a.unwatchedCount);
    default:
      throw new Error();
  }
}

function sortBy(a: api.models.SeriesEntry, b: api.models.SeriesEntry, sort: app.MenuViewModel['sort']['value']): number {
  switch (sort) {
    case 'dateAdded':
      return a.dateAdded.localeCompare(b.dateAdded);
    case 'dateEpisodeAdded':
      const ax = a.dateEpisodeAdded ?? a.dateAdded;
      const bx = b.dateEpisodeAdded ?? b.dateAdded;
      return ax.localeCompare(bx);
    case 'lastPlayed':
      if (a.lastPlayed && b.lastPlayed) return a.lastPlayed.localeCompare(b.lastPlayed);
      if (a.lastPlayed || b.lastPlayed) return a.lastPlayed ? 1 : -1;
      return sortBy(a, b, 'dateEpisodeAdded');
    case 'title':
      return a.title.localeCompare(b.title);
    default:
      throw new Error();
  }
}
