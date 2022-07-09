import * as app from '.';
import * as React from 'react';
import {core} from 'client/core';

export function router(sectionId: string) {
  core.screen.openAsync(async () => {
    const vm = new app.MainViewModel(sectionId);
    await vm.refreshAsync();
    return <app.MainView vm={vm} />;
  });
}
