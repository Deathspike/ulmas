import * as app from '..';

export function fetchEpisodeAdded(episodes: Array<app.api.models.Episode>) {
  const datesAdded = episodes.map(x => x.dateAdded);
  datesAdded.sort((a, b) => b.localeCompare(a));
  return datesAdded.length ? datesAdded[0] : undefined;
}

export function fetchUnwatchedCount(episodes: Array<app.api.models.Episode>) {
  const watchedCount = episodes.filter(x => x.watched).length;
  const unwatchedCount = episodes.length - watchedCount;
  return unwatchedCount || undefined;
}
