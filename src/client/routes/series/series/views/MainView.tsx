import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const MainView = ui.createView<{vm: app.MainViewModel}>(props => props.vm.source && (
  <ui.HeaderView title={props.vm.source.title} onBack={() => props.vm.onBack()}>
    <ui.material.Grid sx={styles.rootContainer}>
      <ui.material.Grid sx={styles.imageContainer}>
        <ui.ImageView imageHeight={36} imageUrl={props.vm.posterUrl}>
          <ui.WatchView value={props.vm.unwatchedCount ?? 0} />
        </ui.ImageView>
      </ui.material.Grid>
      <ui.material.Grid sx={styles.infoContainer}>
        <ui.material.Typography variant="h1" sx={styles.title}>
          {props.vm.source.title}
        </ui.material.Typography>
        <ui.material.Grid>
          <ui.material.Button sx={styles.buttonPrimary}
            disabled={!props.vm.source.episodes.length}
            variant="contained"
            onClick={() => props.vm.playAsync()}>
            <ui.icons.PlayArrow />
          </ui.material.Button>
          <ui.material.Button sx={styles.buttonSecondary}
            color="secondary"
            disabled={!props.vm.source.episodes.length}
            variant="contained"
            onClick={() => props.vm.markAsync()}>
            {props.vm.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
          </ui.material.Button>
          <ui.material.Button sx={styles.buttonSecondary}
            color="secondary"
            variant="contained">
            <ui.icons.InfoOutlined />
          </ui.material.Button>
        </ui.material.Grid>
        <ui.material.Typography sx={styles.plot}>
          {props.vm.source.plot ?? app.language.missingPlot}
        </ui.material.Typography>
        {props.vm.currentSeason
          ? <app.SeasonView vm={props.vm.currentSeason} />
          : <app.SeriesView vm={props.vm} />}
      </ui.material.Grid>
      {props.vm.currentPlayer
        ? <app.core.PlayerView vm={props.vm.currentPlayer} />
        : undefined}
    </ui.material.Grid>
  </ui.HeaderView>
));

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
