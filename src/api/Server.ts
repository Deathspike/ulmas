import * as api from '.';

export class Server {
  constructor(baseUrl: string) {
    this.media = new api.routes.Media();
    this.movies = new api.routes.Movies(new URL('/api/movies/', baseUrl).toString());
    this.sections = new api.routes.Sections(new URL('/api/sections/', baseUrl).toString());
    this.series = new api.routes.Series(new URL('/api/series/', baseUrl).toString());
  }

  readonly media: api.routes.Media;
  readonly movies: api.routes.Movies;
  readonly sections: api.routes.Sections;
  readonly series: api.routes.Series;
}
