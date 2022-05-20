import * as app from '../..';
import {Series} from '../models/Series';
import {mapMedia} from './mapMedia';

export function mapItem(value: Series) {
  const id = value.id;
  const images = mapMedia(value.sources).images;
  const plot = value.plot;
  const title = value.title;
  return new app.api.models.ItemOfSeries({id, images, plot, title});
}
