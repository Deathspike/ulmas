import crypto from 'crypto'
import glob from 'glob';
import path from 'path';
import util from 'util';

export function createValue<T>(resourcePath: string, value: T) {
  const id = createId(resourcePath);
  const path = resourcePath;
  return {...value, id, path};
}

export function mergeProperties<TF, TT extends Object>(source: TF, destination: TT) {
  const unsafeDestination = destination as any;
  Object.entries(source).forEach(([k, v]) => unsafeDestination[k] = v);
}

export async function searchAsync(cwd: string, pattern: string) {
  const globAsync = util.promisify(glob);
  const values = await globAsync(pattern, {cwd});
  return values.map(x => path.join(cwd, x));
}

function createId(resourcePath: string) {
  const hash = crypto.createHash('sha1');
  hash.update(resourcePath, 'binary');
  return hash.digest('hex'); 
}
