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
    {vm.current.value && <ui.material.IconButton sx={styles.inputClear}
      onClick={() => vm.clear()}
      onKeyDown={core.input.keyRestore()}>
      <ui.icons.Clear />
    </ui.material.IconButton>}
    <ui.icons.Search sx={styles.inputSearch} />
  </ui.material.Grid>
));

const styles = {
  inputContainer: {
    height: '3.5vw',
    marginRight: '0.25vw',
    position: 'relative',
    width: '15vw'
  },
  inputSearch: {
    height: '100%',
    pointerEvent: 'none',
    position: 'absolute',
    left: '0.5vw'
  },
  inputClear: {
    position: 'absolute',
    right: '0.5vw',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  input: {
    paddingLeft: '2vw',
    paddingRight: '2.5vw',
    height: '100%',
    width: '100%'
  }
};
