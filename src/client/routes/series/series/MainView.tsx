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
                disabled={!this.props.vm.seasons}
                variant="contained">
                <ui.icons.PlayArrow />
              </ui.material.Button>
              <ui.material.Button sx={styles.buttonSecondary}
                disabled={!this.props.vm.seasons}
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
              {this.props.vm.plot ?? language.missingPlot}
            </ui.material.Typography>
            {this.props.vm.seasons && <React.Fragment>
              <ui.material.Typography variant="h2" sx={styles.title}>
                {language.seasons}
              </ui.material.Typography>
              <ui.ImageLinkGridView imageHeight={23} columns={4} columnGap={2} rowGap={1}>
                {this.props.vm.seasons?.map(x => <app.SeasonView key={x.id} vm={x} /> )}
              </ui.ImageLinkGridView>
            </React.Fragment>}
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
  },
  plot: {
    marginBottom: '1.5vw'
  }
};
