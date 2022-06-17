import {MovieEntry} from './models';
import {SeriesEntry} from './models';

export function sortMovies(a: MovieEntry, b: MovieEntry, sort: 'dateAdded' | 'lastPlayed' | 'premieredDate' | 'title'): number {
  switch (sort) {
    case 'dateAdded':
      const ada = a.dateAdded;
      const bda = b.dateAdded;
      return ada.localeCompare(bda) || sortMovies(a, b, 'title');
    case 'lastPlayed':
      if (a.lastPlayed && b.lastPlayed) return a.lastPlayed.localeCompare(b.lastPlayed);
      if (a.lastPlayed || b.lastPlayed) return a.lastPlayed ? 1 : -1;
      return sortMovies(a, b, 'dateAdded');
    case 'title':
      return a.title.localeCompare(b.title);
    default:
      throw new Error();
  }
}

export function sortSeries(a: SeriesEntry, b: SeriesEntry, sort: 'dateAdded' | 'dateEpisodeAdded' | 'lastPlayed' | 'premieredDate' | 'title'): number {
  switch (sort) {
    case 'dateAdded':
      const aa = a.dateAdded;
      const ba = b.dateAdded;
      return aa.localeCompare(ba) || sortSeries(a, b, 'title');
    case 'dateEpisodeAdded':
      const ae = a.dateEpisodeAdded ?? a.dateAdded;
      const be = b.dateEpisodeAdded ?? b.dateAdded;
      return ae.localeCompare(be) || sortSeries(a, b, 'title');
    case 'lastPlayed':
      if (a.lastPlayed && b.lastPlayed) return a.lastPlayed.localeCompare(b.lastPlayed);
      if (a.lastPlayed || b.lastPlayed) return a.lastPlayed ? 1 : -1;
      return sortSeries(a, b, 'dateEpisodeAdded');
    case 'title':
      return a.title.localeCompare(b.title);
    default:
      throw new Error();
  }
}
