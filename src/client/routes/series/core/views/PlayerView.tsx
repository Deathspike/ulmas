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
            onMouseDown={x => x.preventDefault()}>
            <ui.icons.Close />
          </ui.material.IconButton>
        </ui.material.Grid>
        <ui.ImageView imageHeight={18} imageUrl={vm.thumbUrl}>
          {vm.state !== 'playing' && <ui.ImageLinkIconView onButton={core.input.click(() => vm.continue())}>
            <ui.icons.SkipNext sx={styles.continueIcon} />  
          </ui.ImageLinkIconView>}
        </ui.ImageView>
        <ui.material.LinearProgress
          variant={vm.state !== 'playing' ? 'determinate' : 'indeterminate'}
          value={vm.counter ?? 100} />
        <ui.material.Typography sx={styles.title}>
          {vm.current.episode}. {vm.current.title}
        </ui.material.Typography>
      </ui.material.Grid>
    </ui.material.Backdrop>
  </ui.material.Fade>
));

function getStateTitle(state: app.PlayerViewModel['state']) {
  switch (state) {
    case 'error':
      return app.language.error;
    case 'pending':
      return app.language.pending;
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
  continueIcon: {
    fontSize: '3vw'
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
