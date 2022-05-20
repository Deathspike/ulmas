import * as app from '../..';

export class StreamMap {
  constructor(
    private readonly map: Record<string, {mtime: number, path: string}> = {}) {}
    
  add(mtime: number, name: string, path: string) {
    const id = app.id(path);
    this.map[id] = {mtime, path};
    return new app.api.models.MediaFile({id, name});
  }

  get(id: string) {
    return this.map[id];
  }

  has(path: string) {
    const id = app.id(path);
    return Boolean(this.map[id]);
  }

  toJson() {
    return JSON.stringify(this.map);
  }
}
