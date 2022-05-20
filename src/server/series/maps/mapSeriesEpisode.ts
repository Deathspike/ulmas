import * as app from '../..';
import {Episode} from '../models/Episode';
import {mapMedia} from './mapMedia';

export function mapSeriesEpisode(value: Episode) {
  const media = mapMedia(value.sources);
  return new app.api.models.SeriesEpisode({...value, media});
}
