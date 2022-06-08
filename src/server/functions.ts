import crypto from 'crypto'

export function id(value: string) {
  const hash = crypto.createHash('sha1');
  hash.update(value, 'binary');
  return hash.digest('base64url'); 
}

export async function sequenceAsync<T, R>(items: Array<T>, fn: (item: T) => Promise<R>) {
  const result: Array<R> = Array(items.length);
  for (let i = 0; i < items.length; i++) result[i] = await fn(items[i]);
  return result;
}
