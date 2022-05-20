import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SectionView extends React.Component<{vm: app.SectionViewModel}> {
  render() {
    return (
      <div>
        <h1>{this.props.vm.title}</h1>
        {this.props.vm.series.map(x => <app.SectionSeriesView key={x.id} vm={x} />)}
      </div>
    );
  }
}
