import * as api from 'api';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class ScanService {
  constructor() {
    mobx.makeObservable(this);
  }

  hasMovies(sectionId: string, movieId?: string) {
    return this.scanners.has(movieKey(sectionId, movieId));
  }

  hasSeries(sectionId: string, seriesId?: string) {
    return this.scanners.has(seriesKey(sectionId, seriesId));
  }

  @mobx.action
  async moviesAsync(sectionId: string, movieId?: string) {
    await this.tryAsync(movieKey(sectionId, movieId), () => movieId
      ? core.api.movies.scanItemAsync(sectionId, movieId)
      : core.api.movies.scanListAsync(sectionId));
  }

  @mobx.action
  async seriesAsync(sectionId: string, seriesId?: string) {
    await this.tryAsync(seriesKey(sectionId, seriesId), () => seriesId
      ? core.api.series.scanItemAsync(sectionId, seriesId)
      : core.api.series.scanListAsync(sectionId));
  }

  @mobx.observable
  readonly scanners = new Set<string>();

  private async tryAsync(key: string, promiseFactory: () => Promise<api.ServerResponse<void>>) {
    if (this.scanners.has(key)) return;
    this.scanners.add(key);
    await promiseFactory().catch(() => {});
    this.scanners.delete(key);
  }
}

function movieKey(sectionId: string, movieId?: string) {
  return movieId
    ? `movies/${sectionId}/${movieId}`
    : `movies/${sectionId}`;
}

function seriesKey(sectionId: string, seriesId?: string) {
  return seriesId
    ? `series/${sectionId}/${seriesId}`
    : `series/${sectionId}`;
}
