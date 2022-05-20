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
          {this.props.vm.series?.map(x => <app.SeriesView key={x.id} vm={x} />)}
        </ui.material.Paper>
      </ui.HeaderView>
    );
  }
}

const styles = {
  seriesContainer: {
    display: 'grid',
    gridGap: '1vw 2vw',
    gridTemplateColumns: 'repeat(auto-fill, calc((100% - 10vw) / 6))',
    justifyContent: 'center',
    padding: '1vw 2vw',
    width: '100%'
  }
};
