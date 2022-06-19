import * as api from '..';

export class Media {
  constructor() {}

  async mpvAsync(model: api.models.MediaRequest, signal: AbortSignal) {
    const url = new URL(`http://localhost:6877/api/media/mpv`);
    const request = api.ServerRequest.withJson(url, model, {method: 'POST', signal});
    return request.objectAsync(api.models.MediaResume);
  }
}
