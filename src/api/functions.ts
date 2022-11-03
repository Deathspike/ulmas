import * as api from '.';

export function filterBy(a: api.Entry, filter: api.FilterType) {
  switch (filter) {
    case 'finished':
      return a instanceof api.models.MovieEntry
        ? Boolean(a.watched)
        : Boolean(a.totalCount && !a.unwatchedCount);
    case 'ongoing':
      return a instanceof api.models.MovieEntry
        ? Boolean(a.resume)
        : Boolean(a.unwatchedCount && a.unwatchedCount !== a.totalCount);
    case 'unseen':
      return a instanceof api.models.MovieEntry
        ? Boolean(!a.resume && !a.watched)
        : Boolean(a.totalCount && a.unwatchedCount === a.totalCount);
    default:
      return true;
  }
}

export function sortBy(a: api.Entry, b: api.Entry, sort: api.SortType): number {
  switch (sort) {
    case 'dateAdded':
      const ada = getDateAdded(a);
      const bda = getDateAdded(b);
      return ada.localeCompare(bda) || sortBy(a, b, 'title');
    case 'lastPlayed':
      const alp = a.lastPlayed;
      const blp = b.lastPlayed;
      if (alp && blp) return alp.localeCompare(blp);
      if (alp || blp) return alp ? 1 : -1;
      return sortBy(a, b, 'dateAdded');
    default:
      return a.title.localeCompare(b.title);
  }
}

function getDateAdded(value: api.Entry) {
  return value instanceof api.models.MovieEntry
    ? value.dateAdded
    : value.dateEpisodeAdded ?? value.dateAdded;
}
