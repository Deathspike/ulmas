import * as mobx from 'mobx';

export class DebounceSearch {
  private debounceTimeout?: NodeJS.Timeout;
  
  constructor(private readonly key: string) {
    this.debounceValue = sessionStorage.getItem(key) ?? '';
    this.value = this.debounceValue;
    mobx.makeObservable(this);
  }

  @mobx.action
  clear() {
    this.debounceValue = '';
    this.value = this.debounceValue;
    this.stopDebounce();
    sessionStorage.removeItem(this.key);
  }

  @mobx.action
  change(value: string) {
    if (this.value === value) return;
    this.value = value;
    this.startDebounce();
    sessionStorage.setItem(this.key, value);
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
