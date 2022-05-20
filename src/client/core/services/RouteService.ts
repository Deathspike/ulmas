import {Service} from 'typedi';

@Service()
export class RouteService {
  private params: Record<string, string> = {};

  get(key: string) {
    if (typeof this.params[key] !== 'undefined') {
      return this.params[key] as string;
    } else {
      throw new Error(`Invalid route param: ${key}`);
    }
  }

  set(params: Record<string, string>) {
    this.params = params;
  }
}
