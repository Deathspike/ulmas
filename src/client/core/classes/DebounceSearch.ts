import * as mobx from 'mobx';

export class DebounceSearch {
  private debounceTimeout?: NodeJS.Timeout;
  
  constructor(value = '') {
    this.debounceValue = value;
    this.value = value;
    mobx.makeObservable(this);
  }

  @mobx.action
  clear() {
    this.debounceValue = '';
    this.value = '';
    this.stopDebounce();
  }

  @mobx.action
  change(value: string) {
    if (this.value === value) return;
    this.value = value;
    this.startDebounce();
  }
  
  @mobx.observable
  debounceValue = '';

  @mobx.observable
  value = '';

  private stopDebounce() {
    if (!this.debounceTimeout) return;
    clearInterval(this.debounceTimeout);
    delete this.debounceTimeout;
  }

  private startDebounce() {
    this.stopDebounce();
    this.debounceTimeout = setTimeout(() => {
      this.debounceValue = this.value;
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }, 500);
  }
}
