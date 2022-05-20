import * as api from '..';

export class Movies {
  constructor(
    private readonly baseUrl: string) {}

  async movieListAsync(params: api.params.Section) {
    const url = new URL(`${params.sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<Array<api.models.ItemOfMovies>>(url);
  }

  async movieDetailAsync(params: api.params.Movie) {
    const url = new URL(`${params.sectionId}/${params.movieId}`, this.baseUrl).toString();
    return await api.ServerResponse.jsonAsync<api.models.Movie>(url);
  }

  movieImageUrl(params: api.params.Movie, query: api.queries.Image) {
    const queryString = api.queryString(query);
    return new URL(`${params.sectionId}/${params.movieId}/image` + queryString, this.baseUrl).toString();
  }

  movieVideoUrl(params: api.params.Movie) {
    return new URL(`${params.sectionId}/${params.movieId}/video`, this.baseUrl).toString();
  }
}
