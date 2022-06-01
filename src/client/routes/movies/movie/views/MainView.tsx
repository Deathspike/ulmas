import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(props => props.vm.source && (
  <ui.HeaderView title={props.vm.source.title} onBack={() => core.screen.backAsync()}>
    <ui.material.Grid sx={styles.rootContainer}>
      <ui.material.Grid sx={styles.imageContainer}>
        <ui.ImageView imageHeight={36} imageUrl={props.vm.posterUrl}>
          <ui.WatchView value={props.vm.source.watched ?? false} />
        </ui.ImageView>
      </ui.material.Grid>
    </ui.material.Grid>
    <ui.material.Typography onClick={() => props.vm.watch()}>
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
