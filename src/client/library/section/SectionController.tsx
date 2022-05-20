import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class SectionController extends React.Component<{match: {params: {sectionId: string}}}> {
  private readonly vm = new app.SectionViewModel(this.props.match.params.sectionId);

  componentDidMount() {
    this.vm.refreshAsync();
  }

  render() {
    return <app.SectionView vm={this.vm} />;
  }
}
