import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
  <ui.HeaderView tabIndex={-1} title={app.language.title}
    additionalContent={<app.MenuView vm={vm} />}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}>
    <ui.material.Grid sx={styles.rootContainer}>
      {vm.continueWatching && <ui.material.Grid sx={styles.continueContainer}>
        <ui.material.Typography sx={styles.continueTitle} variant="h3">
          {app.language.continueWatching}
        </ui.material.Typography>
        <ui.ImageLinkGridView imageHeight={21} columns={6} columnGap={2} rowGap={1}>
          {vm.continueWatching.map(x => x instanceof app.movies.MovieViewModel
            ? <app.movies.MovieView key={x.source.id} id={`continue-${x.source.id}`} vm={x} />
            : <app.series.SeriesView key={x.source.id} id={`continue-${x.source.id}`} vm={x} />)}
        </ui.ImageLinkGridView>
      </ui.material.Grid>}
      {vm.sections?.map(x => <app.SectionView key={x.id} vm={x} />)}
    </ui.material.Grid>
  </ui.HeaderView>
));

const styles = {
  rootContainer: {
    minHeight: '100%',
    '& > *:nth-of-type(even)': {backgroundColor: '#444'}
  },
  continueContainer: {
    padding: '1vw 1.5vw 0 1.5vw'
  },
  continueTitle: {
    marginBottom: '1vw'
  }
};
