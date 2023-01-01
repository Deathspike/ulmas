export class Linq<T> implements AsyncIterable<T> {
  constructor(private readonly value: LinqPromise<LinqIterable<T> | T>) {}

  async *[Symbol.asyncIterator]() {
    for await (const value of iterateAsync(this.value)) {
      yield value;
    }
  }

  concat(value: LinqPromise<LinqIterable<T> | T>) {
    async function* concat(this: Linq<T>) {
      for await (const value of iterateAsync(this.value)) yield value;
      const result = await value;
      for await (const value of iterateAsync(result)) yield value;
    }
    return new Linq(concat.call(this));
  }

  async everyAsync(selector: (value: T) => LinqPromise<boolean>) {
    for await (const value of iterateAsync(this.value)) {
      const result = await selector(value);
      if (result) continue;
      return false;
    }
    return true;
  }

  filter(selector: (value: T) => LinqPromise<boolean>) {
    async function* filter(this: Linq<T>) {
      for await (const value of iterateAsync(this.value)) {
        const result = await selector(value);
        if (!result) continue;
        yield value;
      }
    }
    return new Linq(filter.call(this));
  }

  async findAsync(selector: (value: T) => LinqPromise<boolean>) {
    for await (const value of iterateAsync(this.value)) {
      const result = await selector(value);
      if (!result) continue;
      return value;
    }
    return undefined;
  }

  flatMap<R>(selector: (value: T) => LinqPromise<LinqIterable<Nullable<R>>>) {
    async function* flatMap(this: Linq<T>) {
      for await (const value of iterateAsync(this.value)) {
        for await (const result of await selector(value)) {
          if (typeof result === 'undefined' || result == null) continue;
          yield result;
        }
      }
    }
    return new Linq(flatMap.call(this));
  }

  map<R>(selector: (value: T) => LinqPromise<Nullable<R>>) {
    async function* map(this: Linq<T>) {
      for await (const value of iterateAsync(this.value)) {
        const result = await selector(value);
        if (typeof result === 'undefined' || result == null) continue;
        yield result;
      }
    }
    return new Linq(map.call(this));
  }

  async someAsync(selector: (value: T) => LinqPromise<boolean>) {
    for await (const value of iterateAsync(this.value)) {
      const result = await selector(value);
      if (!result) continue;
      return true;
    }
    return false;
  }

  async toArrayAsync() {
    const result = [];
    for await (const value of iterateAsync(this.value)) result.push(value);
    return result;
  }
}

function isIterable<T>(value: LinqIterable<T> | T): value is LinqIterable<T> {
  if (Symbol.asyncIterator in (value as AsyncIterable<T>)) return true;
  if (Symbol.iterator in (value as Iterable<T>)) return true;
  return false;
}

async function* iterateAsync<T>(value: LinqPromise<LinqIterable<T> | T>) {
  const result = await value;
  if (isIterable(result)) for await (const value of result) yield value;
  else yield result;
}

type LinqIterable<T> = AsyncIterable<T> | Iterable<T>;
type LinqPromise<T> = Promise<T> | T;
type Nullable<T> = T | null | undefined | void;
