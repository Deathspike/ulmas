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

  render() {
    return (
      <ui.HeaderView title={this.props.vm.title}>
        <ui.material.Paper sx={styles.seriesContainer} square>
          {this.props.vm.pages?.map((x, i) => <app.PageView key={i} vm={x} />)}
        </ui.material.Paper>
      </ui.HeaderView>
    );
  }
}

const styles = {
  seriesContainer: {
    padding: '1vw 2vw'
  }
};
