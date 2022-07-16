import * as api from 'api';
import * as mobx from 'mobx';

export class Series extends api.routes.Series {
  override async getListAsync(sectionId: string) {
    const result = await super.getListAsync(sectionId);
    if (result.value) result.value.forEach(x => mobx.makeAutoObservable(x));
    return result;
  }

  override async getItemAsync(sectionId: string, resourceId: string) {
    const result = await super.getItemAsync(sectionId, resourceId);
    if (result.value) mobx.makeAutoObservable(result.value);
    return result;
  }
}
