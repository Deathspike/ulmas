import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const SearchView = ui.createView<{vm: app.MainViewModel}>(({vm}) => vm.searchResults && (
  <ui.material.Grid sx={styles.gridContainer}>
    {vm.searchResults.map((x, i) => (
      <ui.ImageLinkGridView key={i} imageHeight={21} columns={6} columnGap={2} rowGap={1}>
        {x.map(x => x instanceof app.movies.MovieViewModel
          ? <app.movies.MovieView key={x.source.id} id={`search-${x.source.id}`} vm={x} />
          : <app.series.SeriesView key={x.source.id} id={`search-${x.source.id}`} vm={x} />)}
      </ui.ImageLinkGridView>
    ))}
  </ui.material.Grid>
));

const styles = {
  gridContainer: {
    padding: '1vw 1.5vw 0 1.5vw'
  }
};
