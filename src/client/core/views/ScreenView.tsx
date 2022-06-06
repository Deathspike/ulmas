import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

@mobxReact.observer
export class ScreenView extends React.Component {
  private restoreFocus?: {restoreActive?: string};
  private restoreScroll?: {restoreX?: number; restoreY?: number};

  componentDidMount() {
    mobx.reaction(() => core.screen.currentView, x => {
      this.restoreFocus = x;
      this.restoreScroll = x;
    });
  }

  componentDidUpdate() {
    this.onRestoreScroll();
    this.onRestoreFocus();
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

  private onRestoreFocus() {
    const element = this.restoreFocus?.restoreActive
      ? document.querySelector(this.restoreFocus.restoreActive)
      : undefined;
    if (element instanceof HTMLElement) {
      element.focus();
      delete this.restoreFocus;
    } else if (this.restoreFocus) {
      requestAnimationFrame(() => this.onRestoreFocus());
    }
  }

  private onRestoreScroll() {
    if (!this.restoreScroll) return;
    window.scrollTo(this.restoreScroll.restoreX ?? 0, this.restoreScroll.restoreY ?? 0);
    delete this.restoreScroll;
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
