import * as mod from '..';
import * as nst from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class ContextService {
  async contextAsync(rootPath: string) {
    const context = new mod.Context();
    const entries = await fs.promises.readdir(rootPath, {withFileTypes: true});
    entries.forEach(x => this.tryAdd(context, rootPath, x));
    return context;
  }
  
  private tryAdd(context: mod.Context, rootPath: string, value: fs.Dirent) {
    const extname = path.extname(value.name);
    const valuePath = path.join(rootPath, value.name);
    if (value.isDirectory()) context.directories[value.name] = valuePath;
    else if (/^\.(gif|jpg|png|webp)$/i.test(extname)) context.images[value.name] = valuePath;
    else if (/^\.(nfo)$/i.test(extname)) context.info[value.name] = valuePath;
    else if (/^\.(ass|srt|vtt)$/i.test(extname)) context.subtitles[value.name] = valuePath;
    else if (/^\.(avi|mp4|mkv|ogm|webm)$/i.test(extname)) context.videos[value.name] = valuePath;
  }
}
