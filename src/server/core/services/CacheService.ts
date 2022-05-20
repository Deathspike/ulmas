import * as app from '../..';
import * as mod from '..';
import * as nst from '@nestjs/common';
import fs from 'fs';
import os from 'os';
import path from 'path';

@nst.Injectable()
export class CacheService implements nst.OnModuleInit {
  private readonly current: Record<string, Promise<Object> | mod.Cache>;
  private readonly previous: Record<string, mod.Cache>;
  private readonly path: string;

  constructor() {
    const packageData = require('../../../../package');
    this.current = {};
    this.previous = {};
    this.path = path.join(os.homedir(), packageData.name, packageData.version);
  }

  async cacheAsync<T>(type: string, resourcePath: string, forceUpdate: boolean, createAsync: () => Promise<T>) {
    const cachePath = path.join(this.path, `${type}-${app.createId(resourcePath)}`);
    const cache = this.previous[cachePath] ?? this.current[cachePath];
    if (!cache || forceUpdate) {
      return this.current[cachePath] = (async () => {
        const value = await createAsync();
        const cache = new mod.Cache(type, value);
        await fs.promises.writeFile(cachePath, JSON.stringify(cache));
        this.current[cachePath] = cache;
        return value;
      })();
    } else if (cache instanceof Promise) {
      return await cache as T;
    } else {
      return cache.value as T;
    }
  }

  async onModuleInit() {
    await fs.promises.mkdir(this.path, {recursive: true});
    const cacheNames = await fs.promises.readdir(this.path);
    const cachePaths = cacheNames.map(x => path.join(this.path, x));
    await app.sequenceAsync(cachePaths, async (cachePath) => {
      const cache = await fs.promises.readFile(cachePath, 'utf-8')
        .then(x => JSON.parse(x) as mod.Cache)
        .catch(() => {});
      if (cache) this.previous[cachePath] = cache;
    });
  }

  async pruneAsync(type: string) {
    const cachePaths = Object.entries(this.previous)
      .filter(([_, x]) => x.type === type)
      .map(([x]) => x);
    for (const cachePath of cachePaths) {
      delete this.previous[cachePath];
      if (this.current[cachePath]) continue;
      await fs.promises.unlink(cachePath);
    }
  }
}
