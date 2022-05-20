import * as app from '.';

export class PageViewModel {
  constructor(
    readonly movies: Array<app.MovieViewModel>) {}
}
