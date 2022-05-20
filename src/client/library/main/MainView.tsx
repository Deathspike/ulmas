import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <div>
        <h1>Library</h1>
        {this.props.vm.sections.map(x => <app.MainSectionView key={x.id} vm={x} />)}
      </div>
    );
  }
}
