import * as app from '.';
import * as mobx from 'mobx';

export class MainViewModel {
  constructor() {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sections = await app.server.sections.sectionListAsync();
    if (sections.value) {
      this.sections = sections.value.map(x => new app.MainSectionViewModel(x));
    } else {
      // Handle error.
    }
  }

  @mobx.observable
  sections = new Array<app.MainSectionViewModel>();
}
