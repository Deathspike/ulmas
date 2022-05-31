import * as app from '..';
import * as mobx from 'mobx';
import {core} from 'client/core';

export class MainViewModel {
  constructor() {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sections = await core.api.sections.readAsync();
    if (sections.value) {
      this.sections = sections.value.map(x => new app.SectionViewModel(x));
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.observable
  sections?: Array<app.SectionViewModel>;
}
