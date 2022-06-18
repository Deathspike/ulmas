import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MenuView = ui.createView<{vm: app.MenuViewModel}>(({vm}) => (
  <ui.material.Grid sx={styles.rootContainer}>
    <ui.material.Grid sx={styles.inputContainer}>
      <ui.material.Input sx={styles.input} disableUnderline inputProps={{tabIndex: 1}}
        value={vm.search.value}
        onChange={x => vm.changeSearch(x.currentTarget.value)}
        onKeyDown={core.input.keyRestore()} />
      <ui.icons.Search sx={styles.inputIcon} />
    </ui.material.Grid>
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
  },
  inputContainer: {
    height: '3.5vw',
    marginRight: '0.25vw',
    position: 'relative',
    width: '15vw'
  },
  inputIcon: {
    height: '100%',
    pointerEvent: 'none',
    position: 'absolute',
    left: '0.5vw'
  },
  input: {
    paddingLeft: '2vw',
    height: '100%',
    width: '100%'
  }
};
