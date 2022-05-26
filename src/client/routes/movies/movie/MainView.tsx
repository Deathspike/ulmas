import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
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
        <ui.material.Grid sx={styles.rootContainer}>
          <ui.material.Grid sx={styles.imageContainer}>
            <ui.ImageView imageHeight={36} imageSrc={this.props.vm.posterSrc}>
              <ui.WatchView value={this.props.vm.watched} />
            </ui.ImageView>
          </ui.material.Grid>
        </ui.material.Grid>
        <ui.material.Typography>
          <ReactLocation.Link to="watch">
            Watch Now
          </ReactLocation.Link>
        </ui.material.Typography>
      </ui.HeaderView>
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
