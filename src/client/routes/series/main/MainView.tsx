import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync() {
    const vm = new app.MainViewModel(core.route.get('sectionId'));
    await vm.refreshAsync();
    return <MainView vm={vm} />;
  }

  render() {
    return (
      <ui.HeaderView title={this.props.vm.title} onBack={() => history.back()}>
        <ui.material.Grid sx={styles.seriesContainer}>
          {this.props.vm.pages?.map((series, i) => (
            <ui.ImageLinkGridView key={i} imageHeight={21} columns={6} columnGap={2} rowGap={1}>
              {series.map(x => <app.SeriesView key={x.id} vm={x} />)}
            </ui.ImageLinkGridView>
          ))}
        </ui.material.Grid>
      </ui.HeaderView>
    );
  }
}

const styles = {
  seriesContainer: {
    padding: '1.5vw'
  }
};
