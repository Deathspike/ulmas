import * as mobx from 'mobx';
import {createSelector} from '..';

export class StateService {
  constructor() {
    mobx.makeObservable(this);
  }

  replace() {
    const state = this.states.pop();
    if (!state) throw new Error();
    window.scrollTo(state.scrollX, state.scrollY);
    requestAnimationFrame(() => this.focusOn(state.focusOn));
  }

  save() {
    const focusOn = createSelector(document.activeElement && document.activeElement !== document.body ? document.activeElement : null);
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    this.states.push({focusOn, scrollX, scrollY});
  }

  @mobx.observable
  states: Array<State> = [];

  private focusOn(selector?: string) {
    const element = selector
      ? document.querySelector<HTMLElement>(selector)
      : undefined;
    element?.focus({preventScroll: true});
  }
}

type State = {
  focusOn?: string;
  scrollX: number;
  scrollY: number;
}
