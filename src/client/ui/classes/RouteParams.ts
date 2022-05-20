export class RouteParams {
  constructor(private readonly items: Record<string, string> = {}) {}

  get(key: string) {
    if (typeof this.items[key] !== 'undefined') {
      return this.items[key] as string;
    } else {
      throw new Error(`Invalid route param: ${key}`);
    }
  }
}
