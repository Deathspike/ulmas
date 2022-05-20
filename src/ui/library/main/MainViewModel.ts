import * as app from '.';
import * as mobx from 'mobx';

export class MainViewModel {
  constructor() {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sectionList = await app.server.sections.readAsync();
    if (sectionList.value) {
      this.sections = sectionList.value.map(x => new app.MainSectionViewModel(x));
    } else {
      // Handle error.
    }
  }

  @mobx.observable
  sections = new Array<app.MainSectionViewModel>();
}
