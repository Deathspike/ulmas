export class ServerResponse<T> {
  private constructor(
    readonly status = 0,
    readonly value?: T) {}

  static async emptyAsync(url: string, options?: RequestInit) {
    return await this.jsonAsync<void>(url, options);
  }

  static async jsonAsync<T>(url: string, options?: RequestInit) {
    const response = await fetch(url, options)
      .catch(() => {});
    const value = response && response.status >= 200 && response.status < 300
      ? await response.json().catch(() => {})
      : undefined;
    return response
      ? new ServerResponse<T>(response.status, value)
      : new ServerResponse<T>();
  }
}
