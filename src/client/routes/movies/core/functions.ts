import * as api from 'api';
import {core} from 'client/core';

export async function resumeAsync(sectionId: string, movie: Writeable<api.models.Movie>, resume: api.models.MediaResume) {
  const patch = new api.models.MoviePatch({resume});
  const response = await core.api.movies.patchAsync(sectionId, movie.id, patch);
  if (response.status !== 204) return;
  movie.resume = resume;
  movie.watched = undefined;
}

export async function watchedAsync(sectionId: string, movie: Writeable<api.models.Movie>, watched: boolean) {
  const patch = new api.models.MoviePatch({watched});
  const response = await core.api.movies.patchAsync(sectionId, movie.id, patch);
  if (response.status !== 204) return;
  movie.resume = undefined;
  movie.watched = watched;
}
