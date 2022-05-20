import * as app from '../..';
import {Episode} from '../models/Episode';
import {mapMedia} from './mapMedia';

export function mapEpisode(value: Episode) {
  const id = value.id;
  const episode = value.episode;
  const media = mapMedia(value.sources);
  const plot = value.plot;
  const season = value.season;
  const title = value.title;
  return new app.api.models.Episode({id, episode, media, plot, season, title});
}
