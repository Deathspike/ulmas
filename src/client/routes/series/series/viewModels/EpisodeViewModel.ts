import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class EpisodeViewModel {
  constructor(private readonly mvm: app.MainViewModel, private readonly sectionId: string, source: api.models.Episode) {
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.action
  handleKey(keyName: string) {
    if (this.mvm.currentPlayer?.isActive) {
      return false;
    } else if (keyName === 'enter' || keyName === 'space') {
      this.playAsync();
      return true;
    } else {
      return false;
    }
  }
  
  @mobx.action
  async markAsync() {
    await core.screen.waitAsync(async () => {
      if (!this.mvm.source) return;
      const model = api.models.SeriesPatch.create([this.source], !this.source.watched);
      await core.api.series.patchItemAsync(this.sectionId, this.mvm.source.id, model);
    });
  }

  @mobx.action
  async playAsync() {
    await this.mvm.playEpisodeAsync(this);
  }

  @mobx.computed
  get thumbUrl() {
    return this.mvm.source
      ? core.image.episode(this.sectionId, this.mvm.source.id, this.source, 'thumb')
      : undefined;
  }
  
  @mobx.computed
  get watchProgress() {
    const maximum = Number(this.source.resume?.total);
    const current = Number(this.source.resume?.position);
    return current / maximum * 100;
  }

  @mobx.observable
  source: api.models.Episode;
}
