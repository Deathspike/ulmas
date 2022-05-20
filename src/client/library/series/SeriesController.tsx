import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SeriesController extends React.Component<{match: {params: {sectionId: string, seriesId: string}}}> {
  private readonly vm = new app.SeriesViewModel(this.props.match.params.sectionId, this.props.match.params.seriesId);

  componentDidMount() {
    this.vm.refreshAsync();
  }

  render() {
    return <app.SeriesView vm={this.vm} />;
  }
}
