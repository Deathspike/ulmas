import crypto from 'crypto'
import inspector from 'inspector';

export function id(fullPath: string) {
  const hash = crypto.createHash('sha1');
  hash.update(fullPath, 'binary');
  return hash.digest('hex'); 
}

export function isDebugging() {
  const url = inspector.url();
  return Boolean(url);
}

export async function sequenceAsync<T, R>(items: Array<T>, fn: (item: T) => Promise<R>) {
  const result: Array<R> = Array(items.length);
  for (let i = 0; i < items.length; i++) result[i] = await fn(items[i]);
  return result;
}
