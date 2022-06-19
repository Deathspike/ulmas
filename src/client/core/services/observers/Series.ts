import * as api from 'api';
import * as mobx from 'mobx';

export class Series extends api.routes.Series {
  override async entriesAsync(sectionId: string) {
    const result = await super.entriesAsync(sectionId);
    if (result.value) result.value.forEach(x => mobx.makeAutoObservable(x));
    return result;
  }

  override async itemAsync(sectionId: string, resourceId: string) {
    const result = await super.itemAsync(sectionId, resourceId);
    if (result.value) mobx.makeAutoObservable(result.value);
    return result;
  }
}
