import * as nst from '@nestjs/common';

@nst.Injectable()
export class LockService {
  private readonly entries: Record<string, Promise<any>> = {};

  async lockAsync<T>(key: string, runAsync: () => Promise<T>) {
    await this.waitAsync(key);
    this.entries[key] = runAsync().finally(() => delete this.entries[key]);
    return await this.entries[key] as T;
  }

  private async waitAsync(key: string) {
    while (true) {
      const value = this.entries[key];
      if (!value) break;
      await value.catch(() => {});
    }
  }
}
