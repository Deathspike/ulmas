import * as app from '../..';
import {Movie} from '../models/Movie';
import {remapSources} from './remapSources';

export function remapEntry(value: Movie) {
  const images = remapSources(value.sources).images;
  return new app.api.models.ItemOfMovies({...value, images});
}
