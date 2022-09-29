import * as React from 'react';
import * as ui from 'client/ui';

export const SpinView = ui.createView<Props>(({children, isSpinning}) => (
  <ui.material.Box sx={isSpinning ? styles.rootSpinner : styles.root}>
    {children}
  </ui.material.Box>
));

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  isSpinning: boolean;
}

const styles = {
  root: {
    display: 'inline-flex'
  },
  rootSpinner: {
    animation: 'spinner 2s linear infinite',
    display: 'inline-flex'
  }
};
