import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';
import {language} from './language';

@mobxReact.observer
export class PlayerView extends React.Component<{vm: app.PlayerViewModel}> {
  componentWillUnmount() {
    this.props.vm.close();
  }

  render() {
    return (
      <ui.material.Fade in={this.props.vm.isActive} unmountOnExit>
        <ui.material.Backdrop open>
          <ui.material.Grid sx={styles.rootContainer}>
            <ui.material.Grid sx={styles.titleContainer}>
              <ui.material.Typography variant="h3">
                {getStateTitle(this.props.vm.state)}
              </ui.material.Typography>
              <ui.material.IconButton sx={styles.closeButton} onClick={() => this.props.vm.close()}>
                <ui.icons.Close />
              </ui.material.IconButton>
            </ui.material.Grid>
            <ui.ImageView imageHeight={18} imageUrl={core.image.episode(this.props.vm.series, this.props.vm.episode, 'thumb')}>
              <ui.material.Fade in={this.props.vm.state !== 'playing'}>
                <ui.material.IconButton sx={styles.continueButton} onClick={() => this.props.vm.continue()}>
                  <ui.icons.SkipNext sx={styles.continueIcon} />
                </ui.material.IconButton>
              </ui.material.Fade>
            </ui.ImageView>
            <ui.material.LinearProgress
              variant={this.props.vm.state !== 'playing' ? 'determinate' : 'indeterminate'}
              value={this.props.vm.counter ?? 100} />
            <ui.material.Typography sx={styles.title}>
              {this.props.vm.episode.episode}. {this.props.vm.episode.title}
            </ui.material.Typography>
          </ui.material.Grid>
        </ui.material.Backdrop>
      </ui.material.Fade>
    );
  }
}

function getStateTitle(state: app.PlayerViewModel['state']) {
  switch (state) {
    case 'error':
      return language.stateError;
    case 'pending':
      return language.statePending;
    default:
      return language.statePlaying;
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
