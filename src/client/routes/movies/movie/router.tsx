import * as app from '.';
import * as React from 'react';
import {core} from 'client/core';

export function movie(sectionId: string, movieId: string) {
  core.screen.openAsync(async () => {
    const vm = new app.MainViewModel(sectionId, movieId);
    await vm.refreshAsync();
    return <app.MainView vm={vm} />;
  });
}
