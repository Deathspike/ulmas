import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const NormalView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
  <React.Fragment>
    {vm.continueWatching && <ui.material.Grid sx={styles.gridContainer}>
      <ui.material.Typography sx={styles.title} variant="h3">
        {app.language.continueWatching}
      </ui.material.Typography>
      <ui.ImageLinkGridView imageHeight={21} columns={6} columnGap={2} rowGap={1}>
        {vm.continueWatching.map(x => x instanceof app.movies.MovieViewModel
          ? <app.movies.MovieView key={x.source.id} id={`continue-${x.source.id}`} vm={x} />
          : <app.series.SeriesView key={x.source.id} id={`continue-${x.source.id}`} vm={x} />)}
      </ui.ImageLinkGridView>
    </ui.material.Grid>}
    {vm.source?.map(x => <app.SectionView key={x.id} vm={x} />)}
  </React.Fragment>
));

const styles = {
  gridContainer: {
    padding: '1vw 1.5vw 0 1.5vw'
  },
  title: {
    marginBottom: '1vw'
  }
};
