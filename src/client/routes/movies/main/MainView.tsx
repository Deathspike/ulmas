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
        <ui.material.Grid sx={styles.movieContainer}>
          {this.props.vm.pages?.map((movies, i) => (
            <ui.ImageLinkGridView key={i} imageHeight={21} columns={6} columnGap={2} rowGap={1}>
              {movies.map(x => <app.MovieView key={x.id} vm={x} />)}
            </ui.ImageLinkGridView>
          ))}
        </ui.material.Grid>
      </ui.HeaderView>
    );
  }
}

const styles = {
  movieContainer: {
    padding: '1.5vw'
  }
};
