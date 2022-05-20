import * as app from '../..';
import {Episode} from '../models/Episode';
import {remapSources} from './remapSources';

export function remapEpisode(value: Episode) {
  const media = remapSources(value.sources);
  return new app.api.models.Episode({...value, media});
}
