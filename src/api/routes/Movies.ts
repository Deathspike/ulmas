import * as api from '..';

export class Movies {
  constructor(
    private readonly baseUrl: string) {}

  async checkAsync(sectionId: string) {
    const method = 'PUT';
    const url = new URL(`${sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.emptyAsync(url, {method});
  }

  async entriesAsync(sectionId: string) {
    const url = new URL(`${sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<Array<api.models.MovieListItem>>(url);
  }

  async itemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`${sectionId}/${resourceId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<api.models.Movie>(url);
  }

  async patchAsync(sectionId: string, resourceId: string, model: api.bodies.MoviePatch) {
    const body = JSON.stringify(model);
    const headers = {'Content-Type': 'application/json'};
    const method = 'PATCH';
    const url = new URL(`${sectionId}/${resourceId}`, this.baseUrl).toString();
    return await api.ServerResponse.emptyAsync(url, {body, method, headers});
  }

  mediaUrl(sectionId: string, resourceId: string, mediaId: string) {
    return new URL(`${sectionId}/${resourceId}/${mediaId}`, this.baseUrl).toString();
  }
}
