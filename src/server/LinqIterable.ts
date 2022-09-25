export class LinqIterable<T> implements AsyncIterable<T> {
  constructor(
    private readonly items: AsyncIterable<T> | Iterable<T> | Promise<Array<T>>) {}

  async *[Symbol.asyncIterator](): AsyncIterator<T, any, undefined> {
    for await (const item of await this.items) {
      yield item;
    }
  }
  
  concat(otherItems: AsyncIterable<T> | Iterable<T> | Promise<Array<T>>) {
    const self = this;
    return new LinqIterable((async function *() {
      for await (const item of await self.items) yield item;
      for await (const item of await otherItems) yield item;
    })());
  }

  async every(selector: (item: T) => boolean) {
    for await (const item of await this.items) {
      if (selector(item)) continue;
      return false;
    }
    return true;
  }

  filter(selector: (item: T) => boolean) {
    const self = this;
    return new LinqIterable((async function *() {
      for await (const item of await self.items) {
        if (!selector(item)) continue;
        yield item;
      }
    })());
  }

  flatMap<R>(selector: (item: T) => AsyncIterable<R | void> | Iterable<R | void> | Promise<Array<R | void>>) {
    const self = this;
    return new LinqIterable((async function *() {
      for await (const item of await self.items) {
        for await (const result of await selector(item)) {
          if (typeof result === 'undefined' || result == null) continue;
          yield result;
        }
      }
    })());
  }

  map<R>(selector: (item: T) => Promise<R | void> | R | void) {
    const self = this;
    return new LinqIterable((async function *() {
      for await (const item of await self.items) {
        const result = await selector(item);
        if (typeof result === 'undefined' || result == null) continue;
        yield result;
      }
    })());
  }

  async toArray() {
    const result = [];
    for await (const item of await this.items) result.push(item);
    return result;
  }
}
