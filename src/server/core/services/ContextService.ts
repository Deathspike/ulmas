import * as nst from '@nestjs/common';
import {Context} from '../models/Context';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class ContextService {
  async contextAsync(rootPath: string) {
    const context = new Context();
    const names = await fs.promises.readdir(rootPath).catch(() => []);
    for (const name of names) await this.inspectAsync(context, rootPath, name);
    return context;
  }

  private async inspectAsync(context: Context, rootPath: string, name: string) {
    const extname = path.extname(name);
    const stats = await this.statAsync(rootPath, name);
    if (stats.isDirectory()) context.directories.set(name, stats);
    else if (types.images.test(extname)) context.images.set(name, stats);
    else if (types.info.test(extname)) context.info.set(name, stats);
    else if (types.subtitles.test(extname)) context.subtitles.set(name, stats);
    else if (types.videos.test(extname)) context.videos.set(name, stats);
  }

  private async statAsync(rootPath: string, name: string) {
    const fullPath = path.join(rootPath, name);
    const stats = await fs.promises.stat(fullPath);
    return Object.assign(stats, {fullPath});
  }
}

const types = {
  images: /^\.(gif|jpg|png|webp)$/i,
  info: /^\.(nfo)$/i,
  subtitles: /^\.(ass|idx|srt|vtt)$/i,
  videos: /^\.(avi|mp4|mkv|ogm|webm)$/i
};
