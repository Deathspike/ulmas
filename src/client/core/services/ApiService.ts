import * as observers from './observers';

export class ApiService {
  private readonly baseUrl = new URL(`${window.location.protocol}//${window.location.hostname}:6877/`);

  get media() {
    return new observers.Media();
  }

  get movies() {
    return new observers.Movies(this.baseUrl);
  }

  get sections() {
    return new observers.Sections(this.baseUrl);
  }

  get series() {
    return new observers.Series(this.baseUrl);
  }
}
