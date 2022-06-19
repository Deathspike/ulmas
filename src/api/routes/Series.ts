import * as api from '..';

export class Series {
  constructor(
    readonly baseUrl: URL) {}
  
  async entriesAsync(sectionId: string) {
    const url = new URL(`/api/series/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.arrayAsync(api.models.SeriesEntry);
  }

  async inspectAsync(sectionId: string) {
    const url = new URL(`/api/series/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url, {method: 'PUT'});
    return await request.emptyAsync();
  }

  async itemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.objectAsync(api.models.Series);
  }

  async patchAsync(sectionId: string, resourceId: string, model: api.models.SeriesPatch) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const request = api.ServerRequest.withJson(url, model, {method: 'PATCH'});
    return await request.emptyAsync();
  }

  mediaUrl(sectionId: string, resourceId: string, mediaId: string) {
    return new URL(`/api/series/${sectionId}/${resourceId}/${mediaId}`, this.baseUrl).toString();
  }
}
