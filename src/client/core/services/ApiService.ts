import * as api from 'api';
import {Service} from 'typedi';

@Service()
export class ApiService {
  private readonly server = new api.Server(`${window.location.protocol}//${window.location.hostname}:6877/`);

  get media() {
    return this.server.media;
  }

  get movies() {
    return this.server.movies;
  }

  get sections() {
    return this.server.sections;
  }

  get series() {
    return this.server.series;
  }
}
