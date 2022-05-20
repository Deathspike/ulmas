import * as app from '../..';
import * as nst from '@nestjs/common';
import {Cache} from './Cache';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class CacheService implements nst.OnModuleInit {
  private readonly current: Record<string, Cache> = {};
  private readonly invalid: Record<string, string> = {};
  private readonly pending: Record<string, Promise<Object>> = {};

  async cacheAsync<T>(type: string, fullPath: string, forceUpdate: boolean, createAsync: () => Promise<T>) {
    const cachePath = path.join(app.settings.paths.cache, app.id(fullPath));
    const cache = this.current[cachePath];
    if (cache && !forceUpdate) return cache.value as T;
    this.pending[cachePath] ??= this.runAsync(type, cachePath, createAsync);
    return await this.pending[cachePath] as T;
  }

  invalidate(type: string) {
    Object.entries(this.current)
      .filter(([_, x]) => x.type === type)
      .forEach(([k, v]) => this.invalid[k] = v.type);
    return async () => {
      const cachePaths = Object.entries(this.invalid)
        .filter(([_, x]) => x === type)
        .map(([x]) => x);
      for (const cachePath of cachePaths) {
        delete this.current[cachePath];
        delete this.invalid[cachePath];
        await fs.promises.unlink(cachePath);
      }
    };
  }

  async onModuleInit() {
    await fs.promises.mkdir(app.settings.paths.cache, {recursive: true});
    const cacheNames = await fs.promises.readdir(app.settings.paths.cache);
    const cachePaths = cacheNames.map(x => path.join(app.settings.paths.cache, x));
    await app.sequenceAsync(cachePaths, async (cachePath) => {
      const cache = await fs.promises.readFile(cachePath, 'utf-8')
        .then(x => JSON.parse(x) as Cache)
        .catch(() => {});
      if (cache && cache.version === app.settings.app.version) {
        this.current[cachePath] = cache;
      } else {
        await fs.promises.unlink(cachePath);
      }
    });
  }

  private async runAsync<T>(type: string, cachePath: string, createAsync: () => Promise<T>) {
    const cache = new Cache(type, await createAsync(), app.settings.app.version);
    await fs.promises.mkdir(app.settings.paths.cache, {recursive: true});
    await fs.promises.writeFile(cachePath, JSON.stringify(cache));
    this.current[cachePath] = cache;
    delete this.invalid[cachePath];
    delete this.pending[cachePath];
    return cache.value;
  }
}
