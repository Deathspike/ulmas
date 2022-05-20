import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesEpisodeView extends React.Component<{vm: app.SeriesEpisodeViewModel}> {
  render() {
    return (
      <div>
        <a onClick={() => this.props.vm.openAsync()}
          style={{color: 'blue', cursor: 'pointer'}}>
          {this.props.vm.title}
        </a>
      </div>
    );
  }
}
