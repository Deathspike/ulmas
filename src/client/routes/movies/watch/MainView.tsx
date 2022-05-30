import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync() {
    const vm = new app.MainViewModel(core.route.get('sectionId'), core.route.get('movieId'));
    await vm.refreshAsync();
    return <MainView vm={vm} />;
  }

  componentDidMount() {
    this.props.vm.componentDidMount();
  }

  componentWillUnmount() {
    this.props.vm.componentWillUnmount();
  }
  
  render() {
    return (
      <ui.HeaderView title={this.props.vm.title} onBack={() => history.back()}>
        <ui.material.Typography>
          {this.props.vm.title}
        </ui.material.Typography>
      </ui.HeaderView>
    );
  }
}
