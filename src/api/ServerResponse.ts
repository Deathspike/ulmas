export class ServerResponse<T> {
  private constructor(
    readonly status = 0,
    readonly value?: T) {}

  static async emptyAsync(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, options);
      return new ServerResponse<void>(response.status);
    } catch {
      return new ServerResponse<void>();
    }  
  }

  static async jsonAsync<T>(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, options);
      const value = response.status >= 200 && response.status < 300 ? await response.json() : undefined;
      return new ServerResponse<T>(response.status, value);
    } catch {
      return new ServerResponse<T>();
    }
  }
}
