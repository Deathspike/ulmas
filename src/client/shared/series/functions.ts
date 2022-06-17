import * as api from 'api';
import {core} from 'client/core';
import {DateTime} from 'luxon';

export async function resumeAsync(sectionId: string, series: Writeable<api.models.Series>, episodes: Array<Writeable<api.models.Episode>>, resume: api.models.MediaResume) {
  const patch = new api.models.SeriesPatch({episodes: episodes.map(x => ({id: x.id, resume}))});
  const response = await core.api.series.patchAsync(sectionId, series.id, patch);
  if (response.status !== 204) return;
  episodes.forEach(x => x.resume = resume);
  episodes.forEach(x => x.watched = false);
  series.lastPlayed = DateTime.utc().toISO({suppressMilliseconds: true});
}

export async function watchedAsync(sectionId: string, series: Writeable<api.models.Series>, episodes: Array<Writeable<api.models.Episode>>, watched: boolean) {
  const patch = new api.models.SeriesPatch({episodes: episodes.map(x => ({id: x.id, watched}))});
  const response = await core.api.series.patchAsync(sectionId, series.id, patch);
  if (response.status !== 204) return;
  episodes.forEach(x => x.resume = undefined);
  episodes.forEach(x => x.watched = watched);
  series.lastPlayed = watched ? DateTime.utc().toISO({suppressMilliseconds: true}) : series.lastPlayed;
}
