import * as app from '.';
import * as React from 'react';
import {core} from 'client/core';

export function open() {
  core.screen.openAsync(async () => {
    const vm = new app.MainViewModel();
    await vm.refreshAsync();
    return <app.MainView vm={vm} />;
  });
}
