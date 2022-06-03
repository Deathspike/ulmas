import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const EpisodeView = ui.createView<{vm: app.EpisodeViewModel}>(props => (
  <ui.material.Grid key={props.vm.source.id} sx={styles.rootContainer} onClick={ui.click(() => props.vm.playAsync())}>
    <ui.material.Grid sx={styles.imageContainer}>
      <ui.ImageView imageHeight={18} imageUrl={props.vm.thumbUrl}>
        {props.vm.source.resume && <ui.material.LinearProgress sx={styles.progress}
          variant="determinate"
          value={props.vm.source.resume.position / props.vm.source.resume.total * 100} />}
        <ui.WatchView value={Boolean(props.vm.source.resume || props.vm.source.watched)} />
      </ui.ImageView>
      <ui.material.Button sx={styles.button}
        color="secondary"
        variant="contained"
        onClick={ui.click(() => props.vm.markAsync())}>
        {props.vm.source.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
      </ui.material.Button>
      <ui.material.Button sx={styles.button}
        color="secondary"
        variant="contained">
        <ui.icons.InfoOutlined />
      </ui.material.Button>
    </ui.material.Grid>
    <ui.material.Grid sx={styles.infoContainer}>
      <ui.material.Typography variant="h3" sx={styles.title}>
        {props.vm.source.episode}. {props.vm.source.title}
      </ui.material.Typography>
      <ui.material.Typography>
        {props.vm.source.plot ?? app.language.missingPlot}
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
    '&:hover': {borderColor: ui.theme.palette.primary.main}
  },
  imageContainer: {
    width: '30vw'
  },
  progress: {
    bottom: 0,
    width: '100%',
    position: 'absolute'
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
