import {MovieEntry} from './models';
import {SeriesEntry} from './models';

export function sortBy(a: MovieEntry | SeriesEntry, b: MovieEntry | SeriesEntry, sort: 'dateAdded' | 'dateEpisodeAdded' | 'lastPlayed' | 'premieredDate' | 'title'): number {
  switch (sort) {
    case 'dateAdded':
      const aa = a.dateAdded;
      const ba = b.dateAdded;
      return aa.localeCompare(ba) || sortBy(a, b, 'title');
    case 'dateEpisodeAdded':
      const ae = getDateEpisodeAdded(a);
      const be = getDateEpisodeAdded(b);
      return ae.localeCompare(be) || sortBy(a, b, 'title');
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

function getDateEpisodeAdded(entry: MovieEntry | SeriesEntry) {
  return entry instanceof MovieEntry
    ? entry.dateAdded
    : entry.dateEpisodeAdded ?? entry.dateAdded;
}
