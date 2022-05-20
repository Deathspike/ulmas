import LazyLoad from 'react-lazyload';
import * as app from '.';
import * as React from 'react';
import * as ui from 'client/ui';

export function PageView(props: {vm: app.PageViewModel}) {
  return (
    <LazyLoad style={styles.pageContainer} once resize>
      <ui.material.Grid sx={styles.page}>
        {props.vm.movies.map(x => <app.MovieView key={x.id} vm={x} />)}
      </ui.material.Grid>
    </LazyLoad>
  );
}

const styles = {
  pageContainer: {
    height: '92vw'
  },
  page: {
    display: 'grid',
    gridGap: '0 2vw',
    gridTemplateColumns: 'repeat(auto-fill, calc((100% - 10vw) / 6))',
    justifyContent: 'center',
    width: '100%'
  }
};
