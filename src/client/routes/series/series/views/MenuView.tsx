import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MenuView = ui.createView<{vm: app.MenuViewModel}>(({vm}) => (
  <ui.material.Grid sx={styles.rootContainer}>
    <ui.material.Grid>
      <ui.material.IconButton tabIndex={1}
        onClick={() => vm.scanAsync()}
        onKeyDown={core.input.keyRestore()}>
        <ui.SpinView isSpinning={vm.isScanning}>
          <ui.icons.Cached />
        </ui.SpinView>
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
