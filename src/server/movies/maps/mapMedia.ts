import * as app from '../..';
import {Source} from '../models/Source';
import path from 'path';

export function mapMedia(values: Array<Source>) {
  const images = values.filter(x => x.type === 'image').map(mapMediaFile);
  const subtitles = values.filter(x => x.type === 'subtitle').map(mapMediaFile);
  const videos = values.filter(x => x.type === 'video').map(mapMediaFile);
  return new app.api.models.Media({images, subtitles, videos});
}

function mapMediaFile(value: Source) {
  const name = path.basename(value.path);
  return new app.api.models.MediaFile({...value, name});
}
