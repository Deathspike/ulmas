import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
  <ui.HeaderView tabIndex={-1} title={app.language.title}
    additionalContent={<app.MenuView vm={vm.menu} />}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}>
    <ui.EventListener onEvent={x => vm.handleEvent(x)} />
    <ui.material.Grid sx={styles.rootContainer}>
      {vm.searchResults
        ? <app.SearchView vm={vm} />
        : <app.NormalView vm={vm} />}
    </ui.material.Grid>
    {vm.currentPlayer instanceof app.movies.PlayerViewModel
      ? <app.movies.PlayerView vm={vm.currentPlayer} />
      : undefined}
    {vm.currentPlayer instanceof app.series.PlayerViewModel
      ? <app.series.PlayerView vm={vm.currentPlayer} />
      : undefined}
  </ui.HeaderView>
));

const styles = {
  rootContainer: {
    minHeight: '100%',
    '& > *:nth-of-type(even)': {backgroundColor: '#444'}
  }
};
