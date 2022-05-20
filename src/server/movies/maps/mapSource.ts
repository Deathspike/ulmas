import * as app from '../..';
import {Source} from '../models/Source';

export function mapSource(source: Source) {
  return new app.api.models.Media({
    id: source.id,
    path: source.path,
    type: source.type
  });
}
