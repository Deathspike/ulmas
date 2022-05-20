import * as api from 'api';
import * as mobx from 'mobx';

export class SectionViewModel {
  constructor(
    private readonly section: api.models.Section) {
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
    switch (this.section.type) {
      case 'movies':
        return `movies/${encodeURIComponent(this.section.id)}`;
      case 'series':
        return `series/${encodeURIComponent(this.section.id)}`;
      default:
        throw new Error();
    }
  }
}
