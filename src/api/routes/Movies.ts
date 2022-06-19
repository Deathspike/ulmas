import * as api from '..';

export class Movies {
  constructor(
    readonly baseUrl: URL) {}

  async entriesAsync(sectionId: string) {
    const url = new URL(`/api/movies/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.arrayAsync(api.models.MovieEntry);
  }

  async inspectAsync(sectionId: string) {
    const url = new URL(`/api/movies/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url, {method: 'PUT'});
    return await request.emptyAsync();
  }

  async itemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`/api/movies/${sectionId}/${resourceId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.objectAsync(api.models.Movie);
  }

  async patchAsync(sectionId: string, resourceId: string, model: api.models.MoviePatch) {
    const url = new URL(`/api/movies/${sectionId}/${resourceId}`, this.baseUrl);
    const request = api.ServerRequest.withJson(url, model, {method: 'PATCH'});
    return await request.emptyAsync();
  }

  mediaUrl(sectionId: string, resourceId: string, mediaId: string) {
    return new URL(`/api/movies/${sectionId}/${resourceId}/${mediaId}`, this.baseUrl).toString();
  }
}
