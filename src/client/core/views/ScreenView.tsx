import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

@mobxReact.observer
export class ScreenView extends React.Component {
  private scrollTo?: {x: number; y: number};

  componentDidMount() {
    mobx.reaction(() => core.screen.currentView, x => this.onViewChanged(x));
  }

  componentDidUpdate() {
    if (!this.scrollTo) return;
    window.scrollTo(this.scrollTo.x, this.scrollTo.y);
    delete this.scrollTo;
  }

  render() {
    return (
      <React.Fragment>
        {core.screen.currentView 
          ? core.screen.currentView.element
          : undefined}
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
    );
  }

  private onViewChanged(view?: {x?: number; y?: number}) {
    const x = view?.x ?? 0;
    const y = view?.y ?? 0;
    this.scrollTo = {x, y};
  }
}

const styles = {
  progress: {
    height: '4vw !important',
    width: '4vw !important',
    position: 'absolute',
    left: 'calc(50% - 2vw)',
    top: 'calc(50% - 2vw)'
  }
};
