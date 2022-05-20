import * as app from '../..';
import * as nst from '@nestjs/common';
import {Cache} from './Cache';
import fs from 'fs';
import os from 'os';
import path from 'path';
const logger = new nst.Logger('Cache');

@nst.Injectable()
export class CacheService implements nst.OnModuleInit {
  private readonly current: Record<string, Cache>;
  private readonly invalid: Record<string, string>;
  private readonly pending: Record<string, Promise<Object>>;
  private readonly rootPath: string;

  constructor() {
    const packageData = require('../../../../package');
    this.current = {};
    this.invalid = {};
    this.pending = {};
    this.rootPath = path.join(os.homedir(), packageData.name, packageData.version);
  }

  async cacheAsync<T>(type: string, resourcePath: string, forceUpdate: boolean, createAsync: () => Promise<T>) {
    const cachePath = path.join(this.rootPath, `${type}-${app.id(resourcePath)}`);
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
        delete this.invalid[cachePath];
        if (this.current[cachePath]) continue;
        await fs.promises.unlink(cachePath);
      }
    };
  }

  async onModuleInit() {
    const cacheNames = await fs.promises.readdir(this.rootPath).catch(() => []);
    const cachePaths = cacheNames.map(x => path.join(this.rootPath, x));
    await app.sequenceAsync(cachePaths, async (cachePath) => {
      const cache = await fs.promises.readFile(cachePath, 'utf-8')
        .then(x => JSON.parse(x) as Cache)
        .catch(() => logger.warn(`Invalid cache: ${cachePath}`));
      if (cache) this.current[cachePath] = cache;
    });
  }

  private async runAsync<T>(type: string, cachePath: string, createAsync: () => Promise<T>) {
    const cache = new Cache(type, await createAsync());
    await fs.promises.mkdir(this.rootPath, {recursive: true});
    await fs.promises.writeFile(cachePath, JSON.stringify(cache));
    this.current[cachePath] = cache;
    delete this.invalid[cachePath];
    delete this.pending[cachePath];
    return cache.value;
  }
}
