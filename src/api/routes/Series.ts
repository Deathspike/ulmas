import * as api from '..';

export class Series {
  constructor(
    readonly baseUrl: URL) {}
  
  async getListAsync(sectionId: string) {
    const url = new URL(`/api/series/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.arrayAsync(api.models.SeriesEntry);
  }

  async scanListAsync(sectionId: string) {
    const url = new URL(`/api/series/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url, {method: 'PUT'});
    return await request.emptyAsync();
  }

  async getItemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.objectAsync(api.models.Series);
  }

  async patchItemAsync(sectionId: string, resourceId: string, model: api.models.SeriesPatch) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const request = api.ServerRequest.withJson(url, model, {method: 'PATCH'});
    return await request.emptyAsync();
  }

  async scanItemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const request = new api.ServerRequest(url, {method: 'PUT'});
    return await request.emptyAsync();
  }

  mediaUrl(sectionId: string, resourceId: string, mediaId: string) {
    return new URL(`/api/series/${sectionId}/${resourceId}/${mediaId}`, this.baseUrl).toString();
  }
}
