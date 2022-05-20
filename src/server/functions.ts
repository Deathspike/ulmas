import path from 'path';

export function createId(resourcePath: string) {
  return path.basename(resourcePath)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]+/g, '')
    .replace(/-+/g, '-');
}

export function createValue<T>(resourcePath: string, value: T) {
  const id = createId(resourcePath);
  const path = resourcePath;
  return {...value, id, path};
}

export function mergeProperties<TF, TT extends Object>(source: TF, destination: TT) {
  const unsafeDestination = destination as any;
  Object.entries(source).forEach(([k, v]) => unsafeDestination[k] = v);
}
