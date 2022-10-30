import {MovieEntry} from './models';
import {SeriesEntry} from './models';

export function filterBy(a: MovieEntry | SeriesEntry, filter: 'all' | 'finished' | 'ongoing' | 'unseen') {
  switch (filter) {
    case 'finished':
      return Boolean(a instanceof MovieEntry ? a.watched : a.totalCount && !a.unwatchedCount);
    case 'ongoing':
      return Boolean(a instanceof MovieEntry ? a.resume : a.unwatchedCount && a.unwatchedCount !== a.totalCount);
    case 'unseen':
      return Boolean(a instanceof MovieEntry ? !a.resume && !a.watched : a.totalCount && a.unwatchedCount === a.totalCount);
    default:
      return true;
  }
}

export function sortBy(a: MovieEntry | SeriesEntry, b: MovieEntry | SeriesEntry, sort: 'dateAdded' | 'lastPlayed' | 'premieredDate' | 'title'): number {
  switch (sort) {
    case 'dateAdded':
      const ada = a instanceof MovieEntry ? a.dateAdded : a.dateEpisodeAdded ?? a.dateAdded;
      const bda = b instanceof MovieEntry ? b.dateAdded : b.dateEpisodeAdded ?? b.dateAdded;
      return ada.localeCompare(bda) || sortBy(a, b, 'title');
    case 'lastPlayed':
      if (a.lastPlayed && b.lastPlayed) return a.lastPlayed.localeCompare(b.lastPlayed);
      if (a.lastPlayed || b.lastPlayed) return a.lastPlayed ? 1 : -1;
      return sortBy(a, b, 'dateAdded');
    default:
      return a.title.localeCompare(b.title);
  }
}
