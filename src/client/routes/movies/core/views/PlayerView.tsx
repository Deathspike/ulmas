import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const PlayerView = ui.createView<{vm: app.PlayerViewModel}>(({vm}) => (
  <ui.material.Fade in={vm.isActive} unmountOnExit>
    <ui.material.Backdrop open>
      <ui.material.Grid sx={styles.rootContainer}>
        <ui.material.Grid sx={styles.titleContainer}>
          <ui.material.Typography variant="h3">
            {getStateTitle(vm.state)}
          </ui.material.Typography>
          <ui.material.IconButton sx={styles.closeButton}
            onClick={core.input.click(() => vm.close())}
            onKeyDown={core.input.keyRestore()}
            onMouseDown={core.input.mouseRestore()}>
            <ui.icons.Close />
          </ui.material.IconButton>
        </ui.material.Grid>
        <ui.ImageView
          imageHeight={18}
          imageUrl={vm.fanartUrl} />
        {vm.state === 'playing'
          ? <ui.material.LinearProgress variant="indeterminate" />
          : undefined}
        <ui.material.Typography sx={styles.title}>
          {vm.movie.title}
        </ui.material.Typography>
      </ui.material.Grid>
    </ui.material.Backdrop>
  </ui.material.Fade>
));

function getStateTitle(state: app.PlayerViewModel['state']) {
  switch (state) {
    case 'error':
      return app.language.error;
    default:
      return app.language.playing;
  }
}

const styles = {
  rootContainer: {
    backgroundColor: '#333',
    width: '30vw',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  titleContainer: {
    position: 'relative',
    padding: '1vw'
  },
  closeButton: {
    position: 'absolute',
    right: '0.5vw',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  title: {
    height: '2vw',
    lineHeight: '2vw',
    padding: '0 0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
