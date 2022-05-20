import crypto from 'crypto'

export function createValue<T>(resourcePath: string, value: T) {
  const id = createId(resourcePath);
  const path = resourcePath;
  return {...value, id, path};
}

export function mergeProperties<TF, TT extends Object>(source: TF, destination: TT) {
  const unsafeDestination = destination as any;
  Object.entries(source).forEach(([k, v]) => unsafeDestination[k] = v);
}

function createId(resourcePath: string) {
  const hash = crypto.createHash('sha1');
  hash.update(resourcePath, 'binary');
  return hash.digest('hex'); 
}
