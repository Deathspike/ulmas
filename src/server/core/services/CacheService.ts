import * as app from '../..';
import * as nst from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class CacheService {
  private readonly entries: Record<string, Promise<any>> = {};

  async forAsync(prefix: string, valueFactory: () => Promise<void>) {
    const startTime = Date.now();
    this.entries[prefix] ??= valueFactory()
      .then(() => this.pruneAsync(prefix, startTime))
      .finally(() => delete this.entries[prefix]);
    await this.entries[prefix];
  }

  private async pruneAsync(prefix: string, startTime: number) {
    const filePaths = await fs.promises.readdir(app.settings.paths.cache).then(x => x
      .filter(x => x.startsWith(prefix))
      .map(x => path.join(app.settings.paths.cache, x)));
    for (const filePath of filePaths) {
      const fileStat = await fs.promises.stat(filePath);
      if (fileStat.mtimeMs >= startTime) continue;
      await fs.promises.unlink(filePath);
    }
  }
}
