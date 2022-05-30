import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';
import {core} from 'client/core';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync() {
    const vm = new app.MainViewModel(core.route.get('sectionId'), core.route.get('movieId'));
    await vm.refreshAsync();
    return <MainView vm={vm} />;
  }

  render() {
    return (
      <React.Fragment>
        {this.props.vm.movie && <ui.HeaderView title={this.props.vm.movie.title} onBack={() => history.back()}>
          <ui.material.Grid sx={styles.rootContainer}>
            <ui.material.Grid sx={styles.imageContainer}>
              <ui.ImageView imageHeight={36} imageUrl={core.image.movie(this.props.vm.movie, 'poster')}>
                <ui.WatchView value={this.props.vm.movie.watched ?? false} />
              </ui.ImageView>
            </ui.material.Grid>
          </ui.material.Grid>
          <ui.material.Typography>
            <ReactLocation.Link to="watch">
              Watch Now
            </ReactLocation.Link>
          </ui.material.Typography>
        </ui.HeaderView>}
      </React.Fragment>
    );
  }
}

const styles = {
  rootContainer: {
    display: 'flex',
    padding: '1.5vw',
    paddingBottom: 0  
  },
  imageContainer: {
    marginRight: '1.5vw',
    marginBottom: '1.5vw',
    width: '24vw'
  }
};
