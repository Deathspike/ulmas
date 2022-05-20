import * as nst from '@nestjs/common';
import {Context} from '../models/Context';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class ContextService {
  async contextAsync(rootPath: string) {
    const context = new Context();
    const items = await fs.promises.readdir(rootPath).catch(() => []);
    for (const item of items) await this.inspectAsync(context, rootPath, item);
    return context;
  }
  
  private async inspectAsync(context: Context, rootPath: string, name: string) {
    const extname = path.extname(name);
    const stats = await this.statAsync(rootPath, name);
    if (stats.isDirectory()) context.directories[name] = stats;
    else if (/^\.(gif|jpg|png|webp)$/i.test(extname)) context.images[name] = stats;
    else if (/^\.(nfo)$/i.test(extname)) context.info[name] = stats;
    else if (/^\.(ass|srt|vtt)$/i.test(extname)) context.subtitles[name] = stats;
    else if (/^\.(avi|mp4|mkv|ogm|webm)$/i.test(extname)) context.videos[name] = stats;
  }

  private async statAsync(rootPath: string, name: string) {
    const fullPath = path.join(rootPath, name);
    const stats = await fs.promises.stat(fullPath);
    return Object.assign(stats, {fullPath});
  }
}
