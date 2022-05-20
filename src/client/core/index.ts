import * as api from '../../api';

export const core = {
  get api() {
    return new api.Server(`${window.location.protocol}//${window.location.hostname}:6877/`);
  }
};
