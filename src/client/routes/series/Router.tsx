import * as app from '.';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';

export function Router() {
  return [
    ui.router.one('/', () => <ReactLocation.Navigate to="/" />),
    ui.router.one('/:sectionId/:seriesId/:season/:episodeId', app.watch.MainView.createAsync),
    ui.router.one('/:sectionId/:seriesId/:season', app.season.MainView.createAsync),
    ui.router.one('/:sectionId/:seriesId', app.series.MainView.createAsync),
    ui.router.one('/:sectionId', app.main.MainView.createAsync)
  ];
}
