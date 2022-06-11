import * as api from 'api';
import * as app from '.';
import * as React from 'react';
import {core} from 'client/core';

export function series(sectionId: string, series: api.models.SeriesEntry, viewState?: any) {
  core.screen.openAsync(async () => {
    const vm = new app.MainViewModel(sectionId, series);
    await vm.refreshAsync();
    return <app.MainView vm={vm} />;
  }, viewState);
}
