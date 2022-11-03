export class ServerResponse<T> {
  constructor(readonly status: number, readonly value?: T) {}
}
