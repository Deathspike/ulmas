import * as app from '../..';
import * as nst from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class CacheService {
  createPurgeable(prefix: string) {
    const startTime = Date.now();
    return async () => {
      const filePaths = await fs.promises.readdir(app.settings.cache).then(x => x
        .filter(x => x.startsWith(prefix))
        .map(x => path.join(app.settings.cache, x)));
      for (const filePath of filePaths) {
        const fileStat = await fs.promises.stat(filePath);
        if (fileStat.mtimeMs >= startTime) continue;
        await fs.promises.unlink(filePath);
      }
    };
  }
}
