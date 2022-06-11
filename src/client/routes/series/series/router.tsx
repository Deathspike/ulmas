import * as app from '.';
import * as React from 'react';
import {core} from 'client/core';

export function series(sectionId: string, seriesId: string, viewState?: any) {
  core.screen.openAsync(async () => {
    const vm = new app.MainViewModel(sectionId, seriesId);
    await vm.refreshAsync();
    return <app.MainView vm={vm} />;
  }, viewState);
}
