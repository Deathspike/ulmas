export function createPages<T>(maxPerPage: number, items?: Array<T>) {
  const result = [];
  for (let i = 0; items && i < items.length; i += maxPerPage) result.push(items.slice(i, i + maxPerPage));
  return result;
}
