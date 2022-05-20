export function property<T extends object, K extends keyof T, V extends T[K]>(name: K, source: T | undefined, sourcePatch: Partial<T> | undefined, value: V) {
  if (sourcePatch?.hasOwnProperty(name)) return sourcePatch[name] as T[K];
  if (source?.hasOwnProperty(name)) return source[name];
  return value;
}

export function queryString(model: Object) {
  return '?' + Object.entries(model)
    .filter(([_, v]) => typeof v !== 'undefined')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}
