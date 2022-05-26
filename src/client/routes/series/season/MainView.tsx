import LazyLoad from 'react-lazyload';
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
        <ui.material.Grid sx={styles.rootContainer}>
          <ui.material.Grid sx={styles.imageContainer}>
            <ui.ImageView imageHeight={36} imageSrc={this.props.vm.posterSrc} />
          </ui.material.Grid>
          <ui.material.Grid sx={styles.infoContainer}>
            <ui.material.Typography variant="h1" sx={styles.title}>
              {this.props.vm.title}
            </ui.material.Typography>
            <ui.material.Grid>
              <ui.material.Button sx={styles.buttonPrimary}
                variant="contained">
                <ui.icons.PlayArrow />
              </ui.material.Button>
              <ui.material.Button sx={styles.buttonSecondary}
                variant="contained"
                color="secondary">
                {this.props.vm.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
              </ui.material.Button>
            </ui.material.Grid>
            <ui.material.Typography variant="h2" sx={styles.title}>
              {this.props.vm.seasonTitle}
            </ui.material.Typography>
            {this.props.vm.pages?.map((episodes, i) => (
              <LazyLoad key={i} style={{height: `${episodes.length * 21.50}vw`}}>
                {episodes?.map(x => <app.EpisodeView key={x.id} vm={x} />)}
              </LazyLoad>
            ))}
          </ui.material.Grid>
        </ui.material.Grid>
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
  },
  infoContainer: {
    flex: 1,
    minWidth: 0
  },
  title: {
    marginBottom: '0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  buttonPrimary: {
    color: '#000',
    marginBottom: '1.5vw'
  },
  buttonSecondary: {
    marginLeft: '0.5vw',
    marginBottom: '1.5vw'
  }
};
