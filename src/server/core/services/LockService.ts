import * as nst from '@nestjs/common';

@nst.Injectable()
export class LockService {
  private readonly entries: Record<string, Promise<any>> = {};

  async lockAsync<T>(key: string, runAsync: () => Promise<T>) {
    while (this.entries[key]) await this.entries[key].catch(() => {});
    this.entries[key] = runAsync().finally(() => delete this.entries[key]);
    return await this.entries[key] as T;
  }
}
