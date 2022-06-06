import * as mobx from 'mobx';
import {createSelector} from './functions/createSelector';

export class ScreenService {
  constructor() {
    mobx.makeObservable(this);
  }

  @mobx.action
  async backAsync() {
    this.views.pop();
    await this.buildAsync();
  }

  @mobx.action
  async openAsync(createAsync: ViewBuilder['createAsync'], restoreState?: any) {
    this.saveState(restoreState);
    this.views.push({createAsync});
    await this.buildAsync();
  }

  @mobx.action
  async waitAsync<T>(runAsync: () => Promise<T>) {
    this.waitCount += 1;
    return await runAsync().finally(() => {
      this.waitCount -= 1;
    });
  }

  @mobx.observable
  currentView?: View;

  @mobx.observable
  views: Array<ViewBuilder> = [];

  @mobx.observable
  waitCount = 0;

  private async buildAsync() {
    await this.waitAsync(async () => {
      const builder = this.views.length
        ? this.views[this.views.length - 1]
        : undefined;
      const element = builder
        ? await builder.createAsync(builder.restoreState)
        : undefined;
      this.currentView = element
        ? {element, ...builder}
        : this.currentView;
    });
  }

  private saveState(restoreState?: any) {
    const view = this.views[this.views.length - 1];
    if (view) view.restoreActive = createSelector(document.activeElement);
    if (view) view.restoreState = restoreState;
    if (view) view.restoreX = window.scrollX;
    if (view) view.restoreY = window.scrollY;
  }
}

type View = {
  element: JSX.Element;
  restoreActive?: string;
  restoreX?: number;
  restoreY?: number;
};

type ViewBuilder = {
  createAsync: (restoreState?: any) => Promise<JSX.Element> | JSX.Element;
  restoreActive?: string;
  restoreState?: any;
  restoreX?: number;
  restoreY?: number;
};
