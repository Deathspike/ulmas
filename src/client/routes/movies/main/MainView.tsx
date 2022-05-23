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
        <ui.material.Paper sx={styles.movieContainer} square>
          {this.props.vm.pages?.map((movies, i) => (
            <ui.ImageLinkGridView key={i} columns={6} gapSize={2} imageHeight={21} titleHeight={3}>
              {movies.map(x => <app.MovieView key={x.id} vm={x} />)}
            </ui.ImageLinkGridView>
          ))}
        </ui.material.Paper>
      </ui.HeaderView>
    );
  }
}

const styles = {
  movieContainer: {
    padding: ui.sz(16)
  }
};
