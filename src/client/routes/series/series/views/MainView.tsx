import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => vm.source && (
  <ui.HeaderView tabIndex={-1} title={vm.source.title}
    onButton={core.input.click(() => vm.onBack())}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}>
    <ui.material.Grid sx={styles.rootContainer}>
      <ui.material.Grid sx={styles.imageContainer}>
        <ui.ImageView imageHeight={36} imageUrl={vm.posterUrl}>
          <ui.WatchView value={vm.unwatchedCount ?? 0} />
        </ui.ImageView>
      </ui.material.Grid>
      <ui.material.Grid sx={styles.infoContainer}>
        <ui.material.Typography variant="h1" sx={styles.title}>
          {vm.source.title}
        </ui.material.Typography>
        <ui.material.Grid>
          <ui.material.Button sx={styles.buttonPrimary} ref={ui.autoFocus()}
            disabled={!vm.source.episodes.length}
            variant="contained"
            onClick={core.input.click(() => vm.playAsync())}
            onKeyDown={core.input.keyRestore()}>
            <ui.icons.PlayArrow />
          </ui.material.Button>
          <ui.material.Button sx={styles.buttonSecondary}
            color="secondary"
            disabled={!vm.source.episodes.length}
            variant="contained"
            onClick={core.input.click(() => vm.markAsync())}
            onKeyDown={core.input.keyRestore()}>
            {vm.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
          </ui.material.Button>
          <ui.material.Button sx={styles.buttonSecondary}
            color="secondary"
            variant="contained"
            onKeyDown={core.input.keyRestore()}>
            <ui.icons.InfoOutlined />
          </ui.material.Button>
        </ui.material.Grid>
        <ui.material.Typography sx={styles.plot}>
          {vm.source.plot ?? app.language.missingPlot}
        </ui.material.Typography>
        {vm.currentSeason
          ? <app.SeasonView vm={vm.currentSeason} />
          : <app.SeriesView vm={vm} />}
      </ui.material.Grid>
      {vm.currentPlayer
        ? <app.core.PlayerView vm={vm.currentPlayer} />
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
