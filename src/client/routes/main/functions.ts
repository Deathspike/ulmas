import * as app from '.';

export function createFilter(menu: app.menu.MenuViewModel) {
  const filter = app.menu.createFilter(menu);
  return (a: app.movies.MovieViewModel | app.series.SeriesViewModel) => {
    return filter(a.source);
  };
}

export function createSort(menu: app.menu.MenuViewModel) {
  const sorter = app.menu.createSort(menu);
  return (a: app.movies.MovieViewModel | app.series.SeriesViewModel, b: app.movies.MovieViewModel | app.series.SeriesViewModel) => {
    return sorter(a.source, b.source);
  };
}
