import * as app from '.';
import * as React from 'react';
import {core} from 'client/core';

export function main(sectionId: string) {
  core.screen.openAsync(async (viewState?: app.ViewState) => {
    const vm = new app.MainViewModel(sectionId, viewState);
    await vm.refreshAsync();
    return <app.MainView vm={vm} />;
  });
}
