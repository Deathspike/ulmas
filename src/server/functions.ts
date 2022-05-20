import crypto from 'crypto'

export function id(fullPath: string) {
  const hash = crypto.createHash('sha1');
  hash.update(fullPath, 'binary');
  return hash.digest('hex'); 
}

export function mergeSetters<T, R>(source: T, destination: R) {
  const prototype = Object.getPrototypeOf(destination);
  const unsafeSource = source as any;
  for (const [x, y] of Object.entries(Object.getOwnPropertyDescriptors(prototype))) {
    if (typeof y.set !== 'function') continue;
    y.set.call(destination, unsafeSource[x]);
  }
}

export async function sequenceAsync<T, R>(items: Array<T>, fn: (item: T) => Promise<R>) {
  const result: Array<R> = Array(items.length);
  for (let i = 0; i < items.length; i++) result[i] = await fn(items[i]);
  return result;
}
