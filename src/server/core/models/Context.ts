import fs from 'fs';
import path from 'path';

export class Context {
  private constructor(
    private readonly rootPath: string) {}

  static async loadAsync(rootPath: string) {
    const context = new Context(rootPath);
    const files = await fs.promises.readdir(rootPath, {withFileTypes: true});
    files.forEach(context.tryAdd.bind(context));
    return context;
  }

  private tryAdd(item: fs.Dirent) {
    const extname = path.extname(item.name);
    const resourcePath = path.join(this.rootPath, item.name);
    if (item.isDirectory()) this.directories[item.name] = resourcePath;
    else if (/^\.(gif|jpg|png|webp)$/i.test(extname)) this.images[item.name] = resourcePath;
    else if (/^\.(nfo)$/i.test(extname)) this.info[item.name] = resourcePath;
    else if (/^\.(ass|srt|vtt)$/i.test(extname)) this.subtitles[item.name] = resourcePath;
    else if (/^\.(avi|mp4|mkv|ogm|webm)$/i.test(extname)) this.videos[item.name] = resourcePath;
  }

  readonly directories: Record<string, string> = {};
  readonly images: Record<string, string> = {};
  readonly info: Record<string, string> = {};
  readonly subtitles: Record<string, string> = {};
  readonly videos: Record<string, string> = {};
}
