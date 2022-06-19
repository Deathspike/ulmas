import * as api from 'api';
import * as mobx from 'mobx';

export class Media extends api.routes.Media {
  override async mpvAsync(model: api.models.MediaRequest, signal: AbortSignal) {
    const result = await super.mpvAsync(model, signal);
    if (result.value) mobx.makeAutoObservable(result.value);
    return result;
  }
}
