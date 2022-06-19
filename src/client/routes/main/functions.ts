import * as app from '.';

export function createFilter(menu: app.MenuViewModel) {
  const search = menu.search.debounceValue
    .toLowerCase()
    .split(' ');
  return (a: app.movies.MovieViewModel | app.series.SeriesViewModel) => {
    const title = a.source.title.toLowerCase();
    return search.every(x => title.includes(x));
  };
}
