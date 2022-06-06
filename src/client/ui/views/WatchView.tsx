import * as React from 'react';
import * as ui from 'client/ui';

export const WatchView = ui.createView<Props>(({children, value, ...props}) => (
  <ui.material.Grid sx={styles.rootContainer} {...props}>
    {typeof value === 'number'
      && value
      && <ui.material.Typography sx={styles.unwatchedCount}>{value}</ui.material.Typography>}
    {typeof value === 'boolean'
      && !value
      && <ui.material.Typography sx={styles.watched} />}
    {children}
  </ui.material.Grid>
));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: boolean | number;
}

const styles = {
  rootContainer: {
    position: 'absolute',
    right: 0,
    top: 0
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
