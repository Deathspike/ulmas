export class Cache {
  constructor(
    readonly type: string,
    readonly value: Object,
    readonly version: string) {}
}
