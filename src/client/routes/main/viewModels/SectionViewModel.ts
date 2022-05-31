import * as api from 'api';
import * as mobx from 'mobx';
import * as routes from 'client/routes';

export class SectionViewModel {
  constructor(source: api.models.Section) {
    this.source = source;
    mobx.makeObservable(this);
  }

  @mobx.action
  open() {
    switch (this.source.type) { 
      case 'movies':
        routes.movies.main(this.source.id);
        break;
      case 'series':
        routes.series.main(this.source.id);
        break;
    }
  }

  @mobx.observable
  source: api.models.Section;
}
