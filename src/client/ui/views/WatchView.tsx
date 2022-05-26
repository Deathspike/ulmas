import * as React from 'react';
import * as ui from 'client/ui';

export function WatchView(props: {value: boolean | number}) {
  return (
    <ui.material.Grid sx={styles.rootContainer}>
      {typeof props.value === 'number'
        && props.value
        && <ui.material.Typography sx={styles.unwatchedCount}>{props.value}</ui.material.Typography>}
      {typeof props.value === 'boolean'
        && !props.value
        && <ui.material.Typography sx={styles.watched} />}
    </ui.material.Grid>
  );
}

const styles = {
  rootContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  unwatchedCount: {
    backgroundColor: ui.theme.palette.primary.dark,
    lineHeight: '2vw',
    minHeight: '2vw',
    minWidth: '2.5vw',
    padding: '0 0.5vw',
    textAlign: 'center'
  },
  watched: {
    background: `linear-gradient(to top right, transparent 0%, transparent 50%, ${ui.theme.palette.primary.dark} 50%, ${ui.theme.palette.primary.dark} 100%)`,
    height: '2vw',
    width: '2vw'
  }
};
