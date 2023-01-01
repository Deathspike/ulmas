import * as app from '..';

export function fetchEpisodeAdded(episodes: Array<app.api.models.Episode>) {
  let result: string | undefined;
  for (const episode of episodes)
    result =
      !result || result.localeCompare(episode.dateAdded) < 0
        ? episode.dateAdded
        : result;
  return result;
}

export function fetchUnwatchedCount(episodes: Array<app.api.models.Episode>) {
  let result = 0;
  for (const episode of episodes) if (!episode.watched) result++;
  return result || undefined;
}
