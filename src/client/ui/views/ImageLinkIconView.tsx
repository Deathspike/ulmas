import * as React from 'react';
import * as ui from 'client/ui';

export const ImageLinkIconView = ui.createView<{icon: JSX.Element, onClick: () => void}>(props => (
  <ui.material.Grid sx={styles.container}>
    <ui.material.IconButton sx={styles.button} onClick={x => Boolean(x.stopPropagation()) || props.onClick()}>
      {props.icon}
    </ui.material.IconButton>
  </ui.material.Grid>
));

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
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    '&:hover': {color: ui.theme.palette.primary.main}
  }
};
