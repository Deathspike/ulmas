import * as api from '..';

export class Movies {
  constructor(
    private readonly baseUrl: string) {}

  async listAsync(params: api.params.Section) {
    const url = new URL(`${params.sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<Array<api.models.ItemOfMovies>>(url);
  }

  async detailAsync(params: api.params.Resource) {
    const url = new URL(`${params.sectionId}/${params.resourceId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<api.models.Movie>(url);
  }

  mediaUrl(params: api.params.Media) {
    return new URL(`${params.sectionId}/${params.resourceId}/${params.mediaId}`, this.baseUrl).toString();
  }
}
