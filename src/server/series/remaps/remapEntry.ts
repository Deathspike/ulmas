import * as app from '../..';
import {Series} from '../models/Series';
import {remapSources} from './remapSources';

export function remapEntry(value: Series) {
  const images = remapSources(value.sources).images;
  return new app.api.models.ItemOfSeries({...value, images});
}
