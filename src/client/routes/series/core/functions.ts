import * as api from 'api';
import {core} from 'client/core';

export async function resumeAsync(sectionId: string, seriesId: string, episodes: Array<Writeable<api.models.Episode>>, resume: api.models.MediaResume) {
  const patch = new api.models.SeriesPatch({episodes: episodes.map(x => ({id: x.id, resume}))});
  const response = await core.api.series.patchAsync(sectionId, seriesId, patch);
  if (response.status !== 204) return;
  episodes.forEach(x => x.resume = resume);
  episodes.forEach(x => x.watched = false);
}

export async function watchedAsync(sectionId: string, seriesId: string, episodes: Array<Writeable<api.models.Episode>>, watched: boolean) {
  const patch = new api.models.SeriesPatch({episodes: episodes.map(x => ({id: x.id, watched}))});
  const response = await core.api.series.patchAsync(sectionId, seriesId, patch);
  if (response.status !== 204) return;
  episodes.forEach(x => x.resume = undefined);
  episodes.forEach(x => x.watched = watched);
}
