import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const EpisodeView = ui.createView<{vm: app.EpisodeViewModel}>(({vm}) => (
  <ui.material.Grid key={vm.source.id} sx={styles.rootContainer} tabIndex={0}
    onClick={core.input.click(() => vm.playAsync())}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}
    onMouseDown={core.input.mouseRestore()}>
    <ui.material.Grid sx={styles.imageContainer}>
      <ui.ImageView imageHeight={18} imageUrl={vm.thumbUrl}>
        <ui.ImageProgressView value={vm.watchProgress} />
        <ui.ImageStatusView value={vm.source.watched ?? false} />
      </ui.ImageView>
      <ui.material.Button sx={styles.button}
        color="secondary"
        variant="contained"
        onClick={core.input.click(() => vm.markAsync())}
        onKeyDown={core.input.keyRestore()}>
        {vm.source.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
      </ui.material.Button>
      <ui.material.Button sx={styles.button}
        color="secondary"
        variant="contained"
        onKeyDown={core.input.keyRestore()}>
        <ui.icons.InfoOutlined />
      </ui.material.Button>
    </ui.material.Grid>
    <ui.material.Grid sx={styles.infoContainer}>
      <ui.material.Typography variant="h3" sx={styles.title}>
        {vm.source.episode}. {vm.source.title}
      </ui.material.Typography>
      <ui.material.Typography>
        {vm.source.plot ?? app.language.missingPlot}
      </ui.material.Typography>
    </ui.material.Grid>
  </ui.material.Grid>
));

const styles = {
  rootContainer: {
    borderLeft: '0.25vw solid transparent',
    cursor: 'pointer',
    display: 'flex',
    marginBottom: '1.5vw',
    '&:focus': {borderColor: ui.theme.palette.primary.light},
    '&:hover': {borderColor: ui.theme.palette.primary.main}
  },
  imageContainer: {
    width: '30vw'
  },
  button: {
    borderRadius: 0,
    width: '50%'
  },
  infoContainer: {
    flex: 1,
    height: '20vw',
    minWidth: 0,
    overflowY: 'auto',
    padding: '0 0.5vw'
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
