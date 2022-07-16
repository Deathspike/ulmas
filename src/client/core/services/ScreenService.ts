import * as mobx from 'mobx';
import {core} from 'client/core';
import {Future} from 'client/core';

export class ScreenService {
  private waitQueue: Promise<any> = Promise.resolve();

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
    requestAnimationFrame(() => Boolean(window.scrollTo(0, 0)) || core.input.tryFocus());
  }

  @mobx.action
  async waitAsync<T>(runAsync: (exclusiveLock: Future<void>) => Promise<T>) {
    let exclusiveLock = new Future<void>();
    let resultPromise: Promise<any>;
    this.waitCount += 1;
    this.waitQueue = this.waitQueue.then(async () => {
      resultPromise = runAsync(exclusiveLock).finally(() => {
        exclusiveLock.resolve();
        this.waitCount -= 1;
      });
      await exclusiveLock.getAsync();
    });
    return await this.waitQueue.then(() => resultPromise) as T;
  }

  @mobx.computed
  get currentView() {
    return this.views.length
      ? this.views[this.views.length - 1]
      : undefined;
  }

  @mobx.observable
  element?: JSX.Element;

  @mobx.observable
  views: Array<ViewBuilder> = [];

  @mobx.observable
  waitCount = 0;

  private async buildAsync() {
    const view = this.currentView;
    const element = view
      ? await view.createAsync()
      : undefined;
    if (view === this.currentView) {
      this.element = element;
    }
  }
}

type ViewBuilder = {
  createAsync: () => Promise<JSX.Element> | JSX.Element;
};
