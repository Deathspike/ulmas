import * as api from '..';

export class Media {
  async mpvAsync(model: api.models.MediaRequest, signal: AbortSignal) {
    const url = new URL(`http://localhost:6877/api/media/mpv`);
    const options = {method: 'POST', signal};
    const request = api.ServerRequest.withJson(url, model, options);
    return await request.objectAsync(api.models.MediaResume);
  }
}
