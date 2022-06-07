import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const ScreenView = ui.createView(() => (
  <React.Fragment>
    {core.screen.currentView}
    {Boolean(core.screen.waitCount) && (
      <ui.material.Backdrop invisible open>
        <ui.material.Fade in style={{transitionDelay: '300ms'}}>
          <ui.material.Backdrop open>
            <ui.material.CircularProgress sx={styles.progress} />
          </ui.material.Backdrop>
        </ui.material.Fade>
      </ui.material.Backdrop>
    )}
  </React.Fragment>
));

const styles = {
  progress: {
    height: '4vw !important',
    width: '4vw !important',
    position: 'absolute',
    left: 'calc(50% - 2vw)',
    top: 'calc(50% - 2vw)'
  }
};
