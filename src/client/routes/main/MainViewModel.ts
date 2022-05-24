import * as api from 'api';
import * as app from '.';
import * as core from 'client/core';
import * as mobx from 'mobx';
import {Service} from 'typedi';

@Service({transient: true})
export class MainViewModel {
  constructor(
    private readonly apiService: core.ApiService) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    const sections = await this.apiService.sections.readAsync();
    if (sections.value) {
      this.source = sections.value;
    } else {
      // TODO: Handle error.
    }
  }

  @mobx.computed
  get sections() {
    return this.source?.map(x => {
      const url = `${encodeURIComponent(x.type)}/${encodeURIComponent(x.id)}`;
      return new app.SectionViewModel(x.id, x.title, url);
    });
  }

  @mobx.observable
  private source?: Array<api.models.Section>;
}
