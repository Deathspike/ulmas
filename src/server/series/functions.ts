import * as app from '..';

export function ensure<T>(items: Array<T | undefined | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}

export function fetchEpisodeAdded(episodes: Array<app.api.models.Episode>) {
  const datesAdded = ensure(episodes.map(x => x.dateAdded));
  datesAdded.sort((a, b) => b.localeCompare(a));
  return datesAdded.length ? datesAdded[0] : undefined;
}

export function fetchUnwatchedCount(episodes: Array<app.api.models.Episode>) {
  const watchedCount = episodes.filter(x => x.watched).length;
  const unwatchedCount = episodes.length - watchedCount;
  return unwatchedCount || undefined;
}
