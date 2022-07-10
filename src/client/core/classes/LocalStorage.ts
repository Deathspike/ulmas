import * as mobx from 'mobx';

export class LocalStorage<T extends string = string> {
  constructor(private readonly key: string, defaultValue: T) {
    this.value = (localStorage.getItem(key) ?? defaultValue) as T;
    mobx.makeObservable(this);
  }

  @mobx.action
  change(value: T) {
    this.value = value;
    localStorage.setItem(this.key, value);
  }

  @mobx.observable
  value: T;
}
