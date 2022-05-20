import * as app from '../..';
import {Episode} from '../models/Episode';
import {mapSource} from './mapSource';

export function mapEpisode(episode: Episode) {
  return new app.api.models.Episode({
    id: episode.id,
    media: episode.media.map(mapSource),
    episode: episode.episode,
    plot: episode.plot,
    season: episode.season,
    title: episode.title
  });
}
