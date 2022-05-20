import * as app from '../..';
import {Movie} from '../models/Movie';
import {remapSources} from './remapSources';

export function remapMovie(value: Movie) {
  const media = remapSources(value.sources);
  return new app.api.models.Movie({...value, media});
}
