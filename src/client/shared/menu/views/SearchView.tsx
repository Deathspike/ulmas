import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const SearchView = ui.createView<{vm: app.SearchViewModel}>(({vm}) => (
  <ui.material.Grid sx={styles.inputContainer}>
    <ui.material.Input sx={styles.input} disableUnderline inputProps={{tabIndex: 1}}
      value={vm.current.value}
      onChange={x => vm.change(x.currentTarget.value)}
      onKeyDown={core.input.keyRestore()} />
    <ui.icons.Search sx={styles.inputIcon} />
  </ui.material.Grid>
));

const styles = {
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
