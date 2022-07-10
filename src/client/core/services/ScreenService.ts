import * as mobx from 'mobx';
import {core} from 'client/core';

export class ScreenService {
  constructor() {
    mobx.makeObservable(this);
  }

  @mobx.action
  async backAsync() {
    this.views.pop();
    await this.buildAsync();
    requestAnimationFrame(() => core.state.replace());
  }

  @mobx.action
  async openAsync(createAsync: ViewBuilder['createAsync']) {
    core.state.save();
    this.views.push({createAsync});
    await this.buildAsync();
    requestAnimationFrame(() => core.input.tryFocus() || window.scrollTo(0, 0));
  }

  @mobx.action
  async waitAsync<T>(runAsync: () => Promise<T>) {
    this.waitCount += 1;
    return await runAsync().finally(() => {
      this.waitCount -= 1;
    });
  }

  @mobx.observable
  currentView?: JSX.Element;

  @mobx.observable
  views: Array<ViewBuilder> = [];

  @mobx.observable
  waitCount = 0;

  private async buildAsync() {
    window.stop();
    await this.waitAsync(async () => {
      const builder = this.views.length
        ? this.views[this.views.length - 1]
        : undefined;
      const element = builder
        ? await builder.createAsync()
        : undefined;
      this.currentView = element
        ? element
        : this.currentView;
    });
  }
}

type ViewBuilder = {
  createAsync: () => Promise<JSX.Element> | JSX.Element;
};
