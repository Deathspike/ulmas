import * as app from '..';

export function ensure<T>(items: Array<T | undefined | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}

export function fetchEpisodeAdded(episodes: Array<app.api.models.Episode>) {
  const datesAdded = ensure(episodes.map(x => x.dateAdded));
  datesAdded.sort((a, b) => b.localeCompare(a));
  return datesAdded.length ? datesAdded[0] : undefined;
}

export function fetchLastPlayed(episodes: Array<app.api.models.Episode>) {
  const lastPlayed = ensure(episodes.map(x => x.lastPlayed));
  lastPlayed.sort((a, b) => b.localeCompare(a));
  return lastPlayed.length ? lastPlayed[0] : undefined;
}

export function fetchUnwatchedCount(episodes: Array<app.api.models.Episode>) {
  const watched = episodes.filter(x => x.watched);
  return episodes.length - watched.length;
}
