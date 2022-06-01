import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const PlayerView = ui.createView<{vm: app.PlayerViewModel}>(props => (
  <ui.material.Fade in={props.vm.isActive} unmountOnExit>
    <ui.material.Backdrop open>
      <ui.material.Grid sx={styles.rootContainer}>
        <ui.material.Grid sx={styles.titleContainer}>
          <ui.material.Typography variant="h3">
            {getStateTitle(props.vm.state)}
          </ui.material.Typography>
          <ui.material.IconButton sx={styles.closeButton} onClick={() => props.vm.close()}>
            <ui.icons.Close />
          </ui.material.IconButton>
        </ui.material.Grid>
        <ui.ImageView imageHeight={18} imageUrl={props.vm.current.thumbUrl}>
          <ui.material.Fade in={props.vm.state !== 'playing'}>
            <ui.material.IconButton sx={styles.continueButton} onClick={() => props.vm.continue()}>
              <ui.icons.SkipNext sx={styles.continueIcon} />
            </ui.material.IconButton>
          </ui.material.Fade>
        </ui.ImageView>
        <ui.material.LinearProgress
          variant={props.vm.state !== 'playing' ? 'determinate' : 'indeterminate'}
          value={props.vm.counter ?? 100} />
        <ui.material.Typography sx={styles.title}>
          {props.vm.current.source.episode}. {props.vm.current.source.title}
        </ui.material.Typography>
      </ui.material.Grid>
    </ui.material.Backdrop>
  </ui.material.Fade>
));

function getStateTitle(state: app.PlayerViewModel['state']) {
  switch (state) {
    case 'error':
      return app.language.stateError;
    case 'pending':
      return app.language.statePending;
    default:
      return app.language.statePlaying;
  }
}

const styles = {
  rootContainer: {
    backgroundColor: '#333',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30vw'
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
  continueButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.5s ease',
    '&:hover': {color: 'primary.main'}
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
