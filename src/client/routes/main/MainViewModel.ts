import * as api from 'api';
import * as app from '.';
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
      this.source = sections.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get sections() {
    return this.source?.map(x => new app.SectionViewModel(x));
  }

  @mobx.observable
  private source?: Array<api.models.Section>;
}
