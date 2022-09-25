import * as app from '.';
import crypto from 'crypto'

export function id(value: string) {
  const hash = crypto.createHash('sha1');
  hash.update(value, 'binary');
  return hash.digest('base64url'); 
}

export function linq<T>(items: AsyncIterable<T> | Iterable<T> | Promise<Array<T>>) {
  return new app.LinqIterable(items);
}
