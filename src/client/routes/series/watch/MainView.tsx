import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {Container} from 'typedi';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync() {
    const vm = Container.get(app.MainViewModel);
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
      <ui.HeaderView title={this.props.vm.title}>
        <ui.material.Typography>
          Loading
        </ui.material.Typography>
      </ui.HeaderView>
    );
  }
}
