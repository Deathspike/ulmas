import * as api from 'api';
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
      this.sections = sections.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.observable
  sections?: Array<api.models.Section>;
}
