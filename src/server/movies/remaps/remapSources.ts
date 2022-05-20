import * as app from '../..';
import {Source} from '../models/Source';
import path from 'path';

export function remapSources(values: Array<Source>) {
  const images = values.filter(x => x.type === 'image').map(file);
  const subtitles = values.filter(x => x.type === 'subtitle').map(file);
  const videos = values.filter(x => x.type === 'video').map(file);
  return new app.api.models.Media({images, subtitles, videos});
}

function file(value: Source) {
  const name = path.basename(value.path);
  return new app.api.models.MediaFile({...value, name});
}
