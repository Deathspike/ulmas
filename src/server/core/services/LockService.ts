import * as nst from '@nestjs/common';

@nst.Injectable()
export class LockService {
  private readonly entries: Record<string, Lock> = {};

  async lockAsync<T>(key: string, reason: string | undefined, runAsync: () => Promise<T>) {
    while (true) {
      if (!this.entries[key]) {
        const result = runAsync().finally(() => delete this.entries[key]);
        this.entries[key] = {reason, result};
        return await result as T;
      } else if (reason && this.entries[key].reason === reason) {
        const result = this.entries[key].result;
        return await result as T;
      } else {
        const result = this.entries[key].result;
        await result.catch(() => {});
      }
    }
  }
}

type Lock = {
  reason?: string;
  result: Promise<any>
};
