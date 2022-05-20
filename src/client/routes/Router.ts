import * as app from '.';
import * as ui from '@/ui';

export function Router() {
  return [
    ui.router.one('/', app.main.MainView.createAsync),
    ui.router.all('/movies', app.movies.Router()),
    ui.router.all('/series', app.series.Router())
  ];
}
