import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => vm.source && (
  <ui.HeaderView title={vm.source.title} onButton={core.input.click(() => core.screen.backAsync())}>
    <ui.material.Grid sx={styles.rootContainer}>
      <ui.material.Grid sx={styles.imageContainer}>
        <ui.ImageView imageHeight={36} imageUrl={vm.posterUrl}>
          <ui.WatchView value={vm.source.watched ?? false} />
        </ui.ImageView>
      </ui.material.Grid>
    </ui.material.Grid>
    <ui.material.Typography onClick={core.input.click(() => vm.watch())}>
      Watch Now
    </ui.material.Typography>
  </ui.HeaderView>
));

const styles = {
  rootContainer: {
    display: 'flex',
    padding: '1.5vw',
    paddingBottom: 0  
  },
  imageContainer: {
    marginRight: '1.5vw',
    marginBottom: '1.5vw',
    width: '24vw'
  }
};
