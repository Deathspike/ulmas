import * as React from 'react';
import * as ui from 'client/ui';

export const ImageProgressView = ui.createView<Props>(({children, value: percentage, ...props}) => (
  <ui.material.Grid sx={styles.rootContainer} {...props}>
    <ui.material.LinearProgress sx={styles.progress}
      variant="determinate"
      value={percentage || 0} />
    {children}
  </ui.material.Grid>
));

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  value: number;
}

const styles = {
  rootContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  progress: {
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transitionProperty: 'opacity',
    '&[aria-valuenow="0"]': {opacity: 0},
    '&[aria-valuenow="100"]': {opacity: 0}
  }
};
