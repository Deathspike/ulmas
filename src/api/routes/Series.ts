import * as api from '..';

export class Series {
  constructor(
    private readonly baseUrl: string) {}

  async checkAsync(sectionId: string) {
    const method = 'PUT';
    const url = new URL(`${sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.emptyAsync(url, {method});
  }
  
  async everyAsync(sectionId: string) {
    const url = new URL(`${sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<Array<api.models.SeriesListItem>>(url);
  }

  async itemAsync(sectionId: string, resourceId: string) {
    const url = new URL(`${sectionId}/${resourceId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<api.models.Series>(url);
  }

  mediaUrl(sectionId: string, resourceId: string, mediaId: string) {
    return new URL(`${sectionId}/${resourceId}/${mediaId}`, this.baseUrl).toString();
  }
}
