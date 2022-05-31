import LazyLoad from 'react-lazyload';
import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export function SeasonView(props: {mvm: app.MainViewModel, vm: app.SeasonViewModel}) {
  return (
    <React.Fragment>
      <ui.material.Typography variant="h2" sx={styles.title}>
        {props.vm.title}
      </ui.material.Typography>
      {props.vm.pages.map((episodes, i) => (
        <LazyLoad key={i} style={{height: `${episodes.length * 21.50}vw`}}>
          {episodes.map(x => <app.EpisodeView key={x.source.id} mvm={props.mvm} vm={x} />)}
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
  }
};
