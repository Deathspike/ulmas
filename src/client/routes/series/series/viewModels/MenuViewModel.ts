import * as mobx from 'mobx';
import {core} from 'client/core';

export class MenuViewModel {
  constructor(private readonly sectionId: string, private readonly seriesId: string) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async scanAsync() {
    await core.scan.seriesAsync(this.sectionId, this.seriesId);
  }

  @mobx.computed
  get isScanning() {
    return core.scan.hasSeries(this.sectionId, this.seriesId);
  }
}
