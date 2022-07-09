import * as mobx from 'mobx';

export class SessionStorage<T extends string = string> {
  constructor(private readonly key: string, defaultValue: T) {
    this.value = (sessionStorage.getItem(key) ?? defaultValue) as T;
    mobx.makeObservable(this);
  }

  @mobx.action
  change(value: T) {
    this.value = value;
    sessionStorage.setItem(this.key, value);
  }

  @mobx.observable
  value: T;
}
