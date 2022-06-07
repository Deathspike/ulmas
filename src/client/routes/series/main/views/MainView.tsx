import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => vm.title && (
  <ui.HeaderView tabIndex={-1} title={vm.title}
    onButton={core.input.click(() => vm.onBack())}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}>
    <ui.material.Grid sx={styles.seriesContainer}>
      {vm.pages?.map((x, i) => (
        <ui.ImageLinkGridView key={i} imageHeight={21} columns={6} columnGap={2} rowGap={1}>
          {x.map(x => <app.SeriesView key={x.source.id} vm={x} />)}
        </ui.ImageLinkGridView>
      ))}
    </ui.material.Grid>
    {vm.currentPlayer
      ? <app.core.PlayerView vm={vm.currentPlayer} />
      : undefined}
  </ui.HeaderView>
));

const styles = {
  seriesContainer: {
    minHeight: '100%',
    padding: '1.5vw'
  }
};
