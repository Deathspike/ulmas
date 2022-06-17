import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const ImageLinkIconView = ui.createView<Props>(({children, onButton, ...props}) => (
  <ui.material.Grid sx={styles.container} {...props}>
    <ui.material.IconButton sx={styles.button} tabIndex={-1}
      onClick={onButton}
      onKeyDown={core.input.keyRestore()}>
      {children}
    </ui.material.IconButton>
  </ui.material.Grid>
));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onButton: (ev: React.MouseEvent) => void;
}

const styles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    '&:hover > *': {opacity: 1}
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
    opacity: 0,
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transitionProperty: 'opacity',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    '&:hover': {color: ui.theme.palette.primary.main}
  }
};
