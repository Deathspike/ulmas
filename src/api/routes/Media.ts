import * as api from '..';

export class Media {
  constructor() {}

  async mpvAsync(model: api.models.MediaRequest) {
    const body = JSON.stringify(model);
    const headers = {'Content-Type': 'application/json'};
    const method = 'POST';
    const url = `http://localhost:6877/api/media/mpv`;
    return await api.ServerResponse.emptyAsync(url, {body, method, headers});
  }
}
