import * as api from '..';

export class ServerRequest {
  private readonly url: string;
  private readonly options?: RequestInit;

  constructor(url: URL, options?: RequestInit) {
    this.url = url.toString();
    this.options = options;
  }

  static withJson(url: URL, value: object, options?: RequestInit) {
    const body = JSON.stringify(value);
    const headers = {'Content-Type': 'application/json'};
    return new ServerRequest(url, {body, headers, ...options});
  }

  async arrayAsync<T extends object>(cls: new (arg: any) => T) {
    try {
      const response = await fetch(this.url, this.options);
      const success = response.status >= 200 && response.status < 300;
      const unsafe = success && (await response.json());
      const value = unsafe && Array.from(unsafe).map(x => new cls(x));
      return new api.ServerResponse<Array<T>>(response.status, value);
    } catch (error) {
      console.error(error);
      return new api.ServerResponse<Array<T>>(0);
    }
  }

  async emptyAsync() {
    try {
      const response = await fetch(this.url, this.options);
      return new api.ServerResponse<void>(response.status);
    } catch (error) {
      console.error(error);
      return new api.ServerResponse<void>(0);
    }
  }

  async objectAsync<T extends object>(cls: new (arg: any) => T) {
    try {
      const response = await fetch(this.url, this.options);
      const success = response.status >= 200 && response.status < 300;
      const unsafe = success && (await response.json());
      const value = unsafe && new cls(unsafe);
      return new api.ServerResponse<T>(response.status, value);
    } catch (error) {
      console.error(error);
      return new api.ServerResponse<T>(0);
    }
  }
}
