import * as app from '../..';
import {Series} from '../models/Series';
import {mapSource} from './mapSource';

export function mapEntry(series: Series) {
  return new app.api.models.ItemOfSeries({
    id: series.id,
    media: series.media.map(mapSource),
    plot: series.plot,
    title: series.title
  });
}
