import crypto from 'crypto'

export function create<T>(resourcePath: string, value: T) {
  const id = createId(resourcePath);
  const path = resourcePath;
  return {...value, id, path};
}

export function createId(resourcePath: string) {
  const hash = crypto.createHash('sha1');
  hash.update(resourcePath, 'binary');
  return hash.digest('hex'); 
}

export function mergeProperties<T, R>(source: T, destination: R) {
  const unsafeDestination = destination as any;
  Object.entries(source).forEach(([k, v]) => unsafeDestination[k] = v);
}

export async function sequenceAsync<T, R>(items: Array<T>, fn: (item: T) => Promise<R>) {
  const result: Array<R> = Array(items.length);
  for (let i = 0; i < items.length; i++) result[i] = await fn(items[i]);
  return result;
}
