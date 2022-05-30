export class RouteService {
  private params: Record<string, string> = {};

  get(key: string) {
    if (this.params[key]) return this.params[key];
    throw new Error(`Invalid route param: ${key}`);
  }

  set(params: Record<string, string>) {
    this.params = params;
  }
}
