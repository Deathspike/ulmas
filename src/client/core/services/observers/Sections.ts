import * as api from 'api';
import * as mobx from 'mobx';

export class Sections extends api.routes.Sections {
  override async readAsync() {
    const result = await super.readAsync();
    if (result.value) result.value.forEach(x => mobx.makeAutoObservable(x));
    return result;
  }
}
