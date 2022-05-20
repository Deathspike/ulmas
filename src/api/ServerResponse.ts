export class ServerResponse<T> {
  private constructor(
    private readonly response: Response,
    private readonly result?: T) {}

  static async emptyAsync(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    return new ServerResponse<void>(response);
  }

  static async jsonAsync<T>(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    const result = await response.json();
    return new ServerResponse<T>(response, result);
  }

  get statusCode() {
    return this.response.status;
  }

  get value() {
    return this.result;
  }
}
