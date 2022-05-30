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
      <ui.material.Dialog open={this.props.vm.isActive}>
        <ui.material.DialogTitle>
          {getStateTitle(this.props.vm.state)}
        </ui.material.DialogTitle>
        <ui.material.IconButton sx={styles.closeButton} onClick={() => this.props.vm.close()}>
          <ui.icons.Close />
        </ui.material.IconButton>
        <ui.material.DialogContent>
          <ui.ImageView imageHeight={18} imageUrl={core.image.episode(this.props.vm.series, this.props.vm.episode, 'thumb')}>
            <ui.material.IconButton sx={styles.continueButton}
              style={{opacity: this.props.vm.state === 'playing' ? 0 : 1}}
              onClick={() => this.props.vm.continue()}>
              <ui.icons.SkipNext sx={styles.continueIcon} />
            </ui.material.IconButton>
            <ui.material.Typography sx={styles.title}>
              {this.props.vm.episode.episode}. {this.props.vm.episode.title}
            </ui.material.Typography>
          </ui.ImageView>
          <ui.material.LinearProgress
            variant={this.props.vm.state === 'playing' ? 'indeterminate' : 'determinate'}
            value={this.props.vm.counter ?? 100} />
        </ui.material.DialogContent>
      </ui.material.Dialog>
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
  closeButton: {
    position: 'absolute',
    right: '0.25vw',
    top: '0.5vw'
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: -2,
    height: '2vw',
    lineHeight: '2vw',
    padding: '0 0.5vw',
    position: 'absolute',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%'
  }
};
