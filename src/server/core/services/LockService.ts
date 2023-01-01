import * as nst from '@nestjs/common';

@nst.Injectable()
export class LockService {
  private readonly entries = new Map<string, Lock>();

  async lockAsync<T>(
    key: string,
    reason: string | undefined,
    runAsync: () => Promise<T>
  ) {
    while (true) {
      const entry = this.entries.get(key);
      if (!entry) {
        const result = runAsync().finally(() => this.entries.delete(key));
        this.entries.set(key, {reason, result});
        return (await result) as T;
      } else if (reason && entry.reason === reason) {
        const result = entry.result;
        return (await result) as T;
      } else {
        const result = entry.result;
        await result.catch(() => {});
      }
    }
  }
}

type Lock = {
  reason?: string;
  result: Promise<any>;
};
