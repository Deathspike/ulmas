import * as app from '../..';
import {Source} from '../models/Source';
import path from 'path';

export function mapMedia(values: Array<Source>) {
  const images = values.filter(x => x.type === 'image').map(mapFile);
  const subtitles = values.filter(x => x.type === 'subtitle').map(mapFile);
  const videos = values.filter(x => x.type === 'video').map(mapFile);
  return new app.api.models.Media({images, subtitles, videos});
}

function mapFile(source: Source) {
  const id = source.id;
  const name = path.basename(source.path);
  return new app.api.models.MediaFile({id, name});
}
