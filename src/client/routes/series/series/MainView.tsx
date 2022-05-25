import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {Container} from 'typedi';
import {language} from './language';

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
        <ui.material.Paper sx={styles.rootContainer} square>
          <ui.material.Grid sx={styles.imageContainer}>
            <ui.ImageView imageHeight={36} imageSrc={this.props.vm.posterSrc} />
          </ui.material.Grid>
          <ui.material.Grid sx={styles.infoContainer}>
            <ui.material.Typography variant="h1" sx={styles.title}>
              {this.props.vm.title}
            </ui.material.Typography>
            <ui.material.Grid>
              <ui.material.Button sx={styles.buttonPrimary}
                disabled={!this.props.vm.hasEpisodes}
                variant="contained">
                <ui.icons.PlayArrow />
              </ui.material.Button>
              <ui.material.Button sx={styles.buttonSecondary}
                disabled={!this.props.vm.hasEpisodes}
                variant="contained"
                color="secondary">
                {this.props.vm.hasWatchedAll ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
              </ui.material.Button>
              <ui.material.Button sx={styles.buttonSecondary}
                variant="contained"
                color="secondary">
                <ui.icons.InfoOutlined />
              </ui.material.Button>
            </ui.material.Grid>
            <ui.material.Typography sx={styles.plot}>
              {this.props.vm.plot ?? language.missingPlot}
            </ui.material.Typography>
            {this.props.vm.hasEpisodes && <React.Fragment>
              <ui.material.Typography variant="h2" sx={styles.title}>
                {language.seasons}
              </ui.material.Typography>
              <ui.ImageLinkGridView columns={4} gapSize={2} imageHeight={23} titleHeight={3}>
                {this.props.vm.seasons?.map(x => <app.SeasonView key={x.id} vm={x} /> )}
              </ui.ImageLinkGridView>
            </React.Fragment>}
          </ui.material.Grid>
          <ui.material.Grid sx={styles.clear} />
        </ui.material.Paper>
      </ui.HeaderView>
    );
  }
}

const styles = {
  rootContainer: {
    display: 'flex',
    padding: ui.sz(16)
  },
  imageContainer: {
    marginRight: ui.sz(16),
    width: '24vw'
  },
  infoContainer: {
    flex: 1,
    minWidth: 0
  },
  title: {
    marginBottom: ui.sz(4),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  buttonPrimary: {
    color: '#000',
    marginBottom: ui.sz(16)
  },
  buttonSecondary: {
    marginLeft: ui.sz(4),
    marginBottom: ui.sz(16)
  },
  plot: {
    marginBottom: ui.sz(16)
  },
  clear: {
    clear: 'both'
  }
}
