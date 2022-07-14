import * as app from '..';
import * as mobx from 'mobx';

export class MenuViewModel {
  constructor(private readonly mvm: app.MainViewModel) {
    mobx.makeObservable(this);
  }

  @mobx.action
  async refreshAsync() {
    await this.mvm.refreshAsync();
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }
}
