import LazyLoad from 'react-lazyload';
import * as app from '.';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';
import {language} from './language';

export function SeasonView(props: {mvm: app.MainViewModel, vm: app.SeasonViewModel}) {
  return (
    <React.Fragment>
      <ui.material.Typography variant="h2" sx={styles.title}>
        {props.vm.title}
      </ui.material.Typography>
      {props.vm.pages.map((episodes, i) => (
        <LazyLoad key={i} style={{height: `${episodes.length * 21.50}vw`}}>
          {episodes.map(x => (
            props.mvm.series && <ui.material.Grid key={x.id} sx={styles.rootContainer} onClick={() => props.mvm.play(x)}>
              <ui.material.Grid sx={styles.imageContainer}>
                <ui.ImageView imageHeight={18} imageUrl={core.image.episode(props.mvm.series, x, 'thumb')}>
                  <ui.WatchView value={x.watched ?? false} />
                </ui.ImageView>
                <ui.material.Button sx={styles.button}
                  variant="contained"
                  color="secondary">
                  {x.watched ? <ui.icons.CheckCircle /> : <ui.icons.CheckCircleOutlined />}
                </ui.material.Button>
                <ui.material.Button sx={styles.button}
                  variant="contained"
                  color="secondary">
                  <ui.icons.InfoOutlined />
                </ui.material.Button>
              </ui.material.Grid>
              <ui.material.Grid sx={styles.infoContainer}>
                <ui.material.Typography variant="h3" sx={styles.title}>
                  {x.episode}. {x.title}
                </ui.material.Typography>
                <ui.material.Typography>
                  {x.plot ?? language.missingPlot}
                </ui.material.Typography>
              </ui.material.Grid>
            </ui.material.Grid>
          ))}
        </LazyLoad>
      ))}
    </React.Fragment>
  )
}

const styles = {
  title: {
    marginBottom: '0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
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
  }
};
