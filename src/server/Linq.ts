export class Linq<T> implements AsyncIterable<T> {
  constructor(
    private readonly value: MaybePromise<AsyncIterable<T> | Iterable<T> | T>) {}

  async *[Symbol.asyncIterator]() {
    for await (const value of iterateAsync(this.value)) {
      yield value;
    }
  }
  
  concat(value: MaybePromise<AsyncIterable<T> | Iterable<T> | T>) {
    const self = this;
    return new Linq((async function *() {
      for await (const value of iterateAsync(self.value)) yield value;
      const result = await value;
      for await (const value of iterateAsync(result)) yield value;
    })());
  }

  async everyAsync(selector: (value: T) => MaybePromise<boolean>) {
    for await (const value of iterateAsync(this.value)) {
      const result = await selector(value);
      if (result) continue;
      return false;
    }
    return true;
  }

  filter(selector: (value: T) => MaybePromise<boolean>) {
    const self = this;
    return new Linq((async function *() {
      for await (const value of iterateAsync(self.value)) {
        const result = await selector(value);
        if (!result) continue;
        yield value;
      }
    })());
  }

  async findAsync(selector: (value: T) => MaybePromise<boolean>) {
    for await (const value of iterateAsync(this.value)) {
      const result = await selector(value);
      if (!result) continue;
      return value;
    }
    return undefined;
  }

  flatMap<R>(selector: (value: T) => MaybePromise<AsyncIterable<Nullable<R>> | Iterable<Nullable<R>>>) {
    const self = this;
    return new Linq((async function *() {
      for await (const value of iterateAsync(self.value)) {
        for await (const result of await selector(value)) {
          if (typeof result === 'undefined' || result == null) continue;
          yield result;
        }
      }
    })());
  }

  map<R>(selector: (value: T) => MaybePromise<Nullable<R>>) {
    const self = this;
    return new Linq((async function *() {
      for await (const value of iterateAsync(self.value)) {
        const result = await selector(value);
        if (typeof result === 'undefined' || result == null) continue;
        yield result;
      }
    })());
  }

  async someAsync(selector: (value: T) => MaybePromise<boolean>) {
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

async function *iterateAsync<T>(value: MaybePromise<AsyncIterable<T> | Iterable<T> | T>) {
  const result = await value;
  if (isIterable(result)) for await (const value of result) yield value;
  else yield result;
}

function isIterable<T>(value: AsyncIterable<T> | Iterable<T> | T): value is AsyncIterable<T> | Iterable<T> {
  if (Symbol.asyncIterator in (value as AsyncIterable<T>)) return true;
  if (Symbol.iterator in (value as Iterable<T>)) return true;
  return false;
}

type MaybePromise<T> = T
  | Promise<T>;
type Nullable<T> = T
  | null
  | undefined
  | void;
