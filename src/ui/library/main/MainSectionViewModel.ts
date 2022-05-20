import * as app from '.';
import * as mobx from 'mobx';

export class MainSectionViewModel {
  constructor(
    private readonly section: app.api.models.Section) {
    mobx.makeObservable(this);
  }

  @mobx.computed
  get id() {
    return this.section.id;
  }

  @mobx.computed
  get title() {
    return this.section.title;
  }

  @mobx.computed
  get url() {
    return this.section.id + '/';
  }
}
