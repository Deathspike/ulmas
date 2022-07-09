import {MovieEntry} from './models';
import {SeriesEntry} from './models';

export function filterBy(a: MovieEntry | SeriesEntry, filter: 'all' | 'played' | 'unplayed') {
  switch (filter) {
    case 'played':
      return a instanceof MovieEntry ? Boolean(a.watched) : !Boolean(a.unwatchedCount);
    case 'unplayed':
      return a instanceof MovieEntry ? !Boolean(a.watched) : Boolean(a.unwatchedCount);
    default:
      return true;
  }
}

export function sortBy(a: MovieEntry | SeriesEntry, b: MovieEntry | SeriesEntry, sort: 'dateAdded' | 'lastPlayed' | 'premieredDate' | 'title'): number {
  switch (sort) {
    case 'dateAdded':
      const aa = a instanceof MovieEntry ? a.dateAdded : a.dateEpisodeAdded ?? a.dateAdded;
      const ba = b instanceof MovieEntry ? b.dateAdded : b.dateEpisodeAdded ?? b.dateAdded
      return aa.localeCompare(ba) || sortBy(a, b, 'title');
    case 'lastPlayed':
      if (a.lastPlayed && b.lastPlayed) return a.lastPlayed.localeCompare(b.lastPlayed);
      if (a.lastPlayed || b.lastPlayed) return a.lastPlayed ? 1 : -1;
      return sortBy(a, b, 'dateAdded');
    default:
      return a.title.localeCompare(b.title);
  }
}
