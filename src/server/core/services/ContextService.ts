import * as nst from '@nestjs/common';
import {Context} from '../models/Context';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class ContextService {
  async contextAsync(rootPath: string) {
    const context = new Context();
    const fileNames = await fs.promises.readdir(rootPath).catch(() => []);
    for (const fileName of fileNames) await this.inspectAsync(context, rootPath, fileName);
    return context;
  }
  
  private async inspectAsync(context: Context, rootPath: string, fileName: string) {
    const extname = path.extname(fileName);
    const stats = await this.statAsync(rootPath, fileName);
    if (stats.isDirectory()) context.directories.set(fileName, stats);
    else if (/^\.(gif|jpg|png|webp)$/i.test(extname)) context.images.set(fileName, stats);
    else if (/^\.(nfo)$/i.test(extname)) context.info.set(fileName, stats);
    else if (/^\.(ass|idx|srt|vtt)$/i.test(extname)) context.subtitles.set(fileName, stats);
    else if (/^\.(avi|mp4|mkv|ogm|webm)$/i.test(extname)) context.videos.set(fileName, stats);
  }

  private async statAsync(rootPath: string, name: string) {
    const fullPath = path.join(rootPath, name);
    const stats = await fs.promises.stat(fullPath);
    return Object.assign(stats, {fullPath});
  }
}
