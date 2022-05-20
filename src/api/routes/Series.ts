import * as api from '..';

export class Series {
  constructor(
    private readonly baseUrl: string) {}

  async checkAsync() {
    const method = 'PUT';
    return await api.ServerResponse.emptyAsync(this.baseUrl, {method});
  }
  
  async listAsync(sectionId: string) {
    const url = new URL(`${sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<Array<api.models.SeriesListItem>>(url);
  }

  async detailAsync(sectionId: string, resourceId: string) {
    const url = new URL(`${sectionId}/${resourceId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<api.models.Series>(url);
  }

  mediaUrl(sectionId: string, resourceId: string, mediaId: string) {
    return new URL(`${sectionId}/${resourceId}/${mediaId}`, this.baseUrl).toString();
  }
}
