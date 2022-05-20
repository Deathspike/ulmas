import * as app from '../..';
import {Series} from '../models/Series';
import {mapMedia} from './mapMedia';

export function mapSeriesListItem(value: Series) {
  const images = mapMedia(value.sources).images;
  return new app.api.models.SeriesListItem({...value, images});
}
