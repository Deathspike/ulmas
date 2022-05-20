import * as api from '..';

export class Series {
  constructor(
    private readonly baseUrl: string) {}

  async seriesListAsync(params: api.params.Section) {
    const url = new URL(`${params.sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<Array<api.models.ItemOfSeries>>(url);
  }

  async seriesDetailAsync(params: api.params.Series) {
    const url = new URL(`${params.sectionId}/${params.seriesId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<api.models.Series>(url);
  }

  seriesImageUrl(params: api.params.Series, query: api.queries.Image) {
    const queryString = api.queryString(query);
    return new URL(`${params.sectionId}/${params.seriesId}/image` + queryString, this.baseUrl).toString();
  }

  async episodeDetailAsync(params: api.params.Episode) {
    const url = new URL(`${params.sectionId}/${params.seriesId}/${params.episodeId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<api.models.Episode>(url);
  }

  episodeImageUrl(params: api.params.Episode, query: api.queries.Image) {
    const queryString = api.queryString(query);
    return new URL(`${params.sectionId}/${params.seriesId}/${params.episodeId}/image` + queryString, this.baseUrl).toString();
  }

  episodeVideoUrl(params: api.params.Episode) {
    return new URL(`${params.sectionId}/${params.seriesId}/${params.episodeId}/video`, this.baseUrl).toString();
  }
}
