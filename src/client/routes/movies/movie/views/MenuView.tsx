import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MenuView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
  <ui.material.Grid sx={styles.rootContainer}>
    <ui.material.Grid>
      <ui.material.IconButton tabIndex={1}
        onClick={() => vm.refreshAsync()}
        onKeyDown={core.input.keyRestore()}>
        <ui.icons.Refresh />
      </ui.material.IconButton>
    </ui.material.Grid>
  </ui.material.Grid>
));

const styles = {
  rootContainer: {
    display: 'flex',
    marginRight: '0.25vw'
  }
};
