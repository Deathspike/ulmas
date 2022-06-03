import * as app from '.';
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
        <ui.ImageView imageHeight={18} imageUrl={props.vm.thumbUrl}>
          {props.vm.state !== 'playing' && <ui.ImageLinkIconView
            icon={<ui.icons.SkipNext sx={styles.continueIcon} />}
            onClick={() => props.vm.continue()} />}
        </ui.ImageView>
        <ui.material.LinearProgress
          variant={props.vm.state !== 'playing' ? 'determinate' : 'indeterminate'}
          value={props.vm.counter ?? 100} />
        <ui.material.Typography sx={styles.title}>
          {props.vm.current.episode}. {props.vm.current.title}
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
