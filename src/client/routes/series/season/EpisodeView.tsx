import * as app from '.';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';
import {language} from './language';

export function EpisodeView(props: {vm: app.EpisodeViewModel}) {
  const navigate = ReactLocation.useNavigate();
  return (
    <ui.material.Grid sx={styles.rootContainer} onClick={() => navigate({to: props.vm.url})}>
      <ui.material.Grid sx={styles.imageContainer}>
        <ui.ImageView imageHeight={18} imageSrc={props.vm.thumbSrc} />
        <ui.material.Button sx={styles.button}
          variant="contained"
          color="secondary">
          {props.vm.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
        </ui.material.Button>
        <ui.material.Button sx={styles.button}
          variant="contained"
          color="secondary">
          <ui.icons.InfoOutlined />
        </ui.material.Button>
      </ui.material.Grid>
      <ui.material.Grid sx={styles.infoContainer}>
        <ui.material.Typography variant="h3" sx={styles.title}>
          {props.vm.title}
        </ui.material.Typography>
        <ui.material.Typography>
          {props.vm.plot ?? language.missingPlot}
        </ui.material.Typography>
      </ui.material.Grid>
    </ui.material.Grid>
  );
}

const styles = {
  rootContainer: {
    borderLeft: '0.25vw solid transparent',
    cursor: 'pointer',
    display: 'flex',
    marginBottom: '1.5vw',
    '&:hover': {borderColor: 'primary.main'}
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
