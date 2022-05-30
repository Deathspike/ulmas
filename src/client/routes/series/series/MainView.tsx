import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';
import {language} from './language';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync() {
    const vm = new app.MainViewModel(core.route.get('sectionId'), core.route.get('seriesId'));
    await vm.refreshAsync();
    return <MainView vm={vm} />;
  }

  render() {
    return (
      <React.Fragment>
        {this.props.vm.series && <ui.HeaderView title={this.props.vm.series.title} onBack={() => this.props.vm.onBack()}>
          <ui.material.Grid sx={styles.rootContainer}>
            <ui.material.Grid sx={styles.imageContainer}>
              <ui.ImageView imageHeight={36} imageUrl={core.image.series(this.props.vm.series, 'poster')} />
            </ui.material.Grid>
            <ui.material.Grid sx={styles.infoContainer}>
              <ui.material.Typography variant="h1" sx={styles.title}>
                {this.props.vm.series.title}
              </ui.material.Typography>
              <ui.material.Grid>
                <ui.material.Button sx={styles.buttonPrimary}
                  disabled={!this.props.vm.series.episodes.length}
                  variant="contained"
                  onClick={() => this.props.vm.play()}>
                  <ui.icons.PlayArrow />
                </ui.material.Button>
                <ui.material.Button sx={styles.buttonSecondary}
                  disabled={!this.props.vm.series.episodes.length}
                  variant="contained"
                  color="secondary">
                  {this.props.vm.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
                </ui.material.Button>
                <ui.material.Button sx={styles.buttonSecondary}
                  variant="contained"
                  color="secondary">
                  <ui.icons.InfoOutlined />
                </ui.material.Button>
              </ui.material.Grid>
              <ui.material.Typography sx={styles.plot}>
                {this.props.vm.series.plot ?? language.missingPlot}
              </ui.material.Typography>
              {this.props.vm.currentSeason
                ? <app.SeasonView vm={this.props.vm.currentSeason} mvm={this.props.vm} />
                : <app.SeriesView vm={this.props.vm} />}
            </ui.material.Grid>
            {this.props.vm.currentPlayer
              ? <app.PlayerView vm={this.props.vm.currentPlayer} />
              : undefined}
          </ui.material.Grid>
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
  },
  plot: {
    marginBottom: '1.5vw'
  }
};
