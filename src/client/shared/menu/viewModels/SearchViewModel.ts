import * as app from '..';
import * as mobx from 'mobx';

export class SearchViewModel {
  private debounceTimeout?: NodeJS.Timeout;
  
  constructor(key: string) {
    this.current = new app.SessionStorage(key, '');
    this.debounceValue = this.current.value;
    mobx.makeObservable(this);
  }

  @mobx.action
  clear() {
    this.debounceValue = '';
    this.current.change(this.debounceValue);
    this.stopDebounce();
  }

  @mobx.action
  change(value: string) {
    this.current.change(value);
    this.startDebounce();
  }

  @mobx.observable
  current: app.SessionStorage;

  @mobx.observable
  debounceValue = '';

  private stopDebounce() {
    if (!this.debounceTimeout) return;
    clearInterval(this.debounceTimeout);
    delete this.debounceTimeout;
  }

  private startDebounce() {
    this.stopDebounce();
    this.debounceTimeout = setTimeout(() => {
      this.debounceValue = this.current.value;
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }, 500);
  }
}
