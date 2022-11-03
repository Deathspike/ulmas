import * as api from '..';
import Patch = api.models.SeriesPatch;

export class Series {
  constructor(private readonly baseUrl: URL) {}

  async getListAsync(sectionId: string) {
    const url = new URL(`/api/series/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.arrayAsync(api.models.SeriesEntry);
  }

  async scanListAsync(sectionId: string) {
    const url = new URL(`/api/series/${sectionId}`, this.baseUrl);
    const options = {method: 'PUT'};
    const request = new api.ServerRequest(url, options);
    return await request.emptyAsync();
  }

  async getItemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.objectAsync(api.models.Series);
  }

  async patchItemAsync(sectionId: string, resourceId: string, model: Patch) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const options = {method: 'PATCH'};
    const request = api.ServerRequest.withJson(url, model, options);
    return await request.emptyAsync();
  }

  async scanItemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`/api/series/${sectionId}/${resourceId}`, this.baseUrl);
    const options = {method: 'PUT'};
    const request = new api.ServerRequest(url, options);
    return await request.emptyAsync();
  }

  mediaUrl(sectionId: string, resourceId: string, mediaId: string) {
    const relativeUrl = `/api/series/${sectionId}/${resourceId}/${mediaId}`;
    return new URL(relativeUrl, this.baseUrl).toString();
  }
}
