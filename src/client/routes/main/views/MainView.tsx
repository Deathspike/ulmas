import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
  <ui.HeaderView tabIndex={-1} title={app.language.title}
    additionalContent={<app.menu.MainView vm={vm.menu} />}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}>
    <ui.EventListener onEventAsync={x => vm.handleEventAsync(x)} />
    <ui.material.Grid sx={styles.rootContainer}>
      {vm.searchResults
        ? <SearchView vm={vm} />
        : <NormalView vm={vm} />}
    </ui.material.Grid>
    {vm.currentPlayer instanceof app.movies.PlayerViewModel
      ? <app.movies.PlayerView vm={vm.currentPlayer} />
      : undefined}
    {vm.currentPlayer instanceof app.series.PlayerViewModel
      ? <app.series.PlayerView vm={vm.currentPlayer} />
      : undefined}
  </ui.HeaderView>
));

const NormalView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
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

const SearchView = ui.createView<{vm: app.MainViewModel}>(({vm}) => vm.searchResults && (
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
  rootContainer: {
    minHeight: '100%',
    '& > *:nth-of-type(even)': {backgroundColor: '#444'}
  },
  gridContainer: {
    padding: '1vw 1.5vw 0 1.5vw'
  },
  title: {
    marginBottom: '1vw'
  }
};
