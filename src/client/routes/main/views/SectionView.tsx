import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const SectionView = ui.createView<{vm: app.SectionMoviesViewModel | app.SectionSeriesViewModel}>(({vm}) => (
  <ui.material.Grid sx={styles.rootContainer} tabIndex={0} data-capture-y
    onClick={core.input.click(() => vm.open())}
    onKeyDown={core.input.keyDown(x => vm.handleKey(x))}
    onMouseDown={core.input.mouseRestore()}>
    <ui.material.Typography key={vm.id} sx={styles.title} variant="h3">
      {vm.title}
    </ui.material.Typography>
    <ui.ImageLinkGridView imageHeight={21} columns={6} columnGap={2} rowGap={1}>
      {vm.previewItems.map(x => (
        <ui.ExclusiveView key={x.source.id}>
          {x instanceof app.movies.MovieViewModel
            ? <app.movies.MovieView id={`${vm.id}-${x.source.id}`} vm={x} />
            : <app.series.SeriesView id={`${vm.id}-${x.source.id}`} vm={x} />}
        </ui.ExclusiveView>
      ))}
    </ui.ImageLinkGridView>
    {vm.previewItems.length
      ? undefined
      : <ui.material.Typography sx={styles.title}>{app.language.missingMedia}</ui.material.Typography>}
  </ui.material.Grid>
));

const styles = {
  rootContainer: {
    borderLeft: '0.25vw solid transparent',
    cursor: 'pointer',
    padding: '1vw 1.5vw 0 1.25vw',
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transitionProperty: 'border-color',
    '&:focus:not(.unfocus)': {borderColor: ui.theme.palette.primary.light},
    '&:hover:not(.unfocus)': {borderColor: ui.theme.palette.primary.main},
    '&:focus:not(.unfocus) > h3': {color: ui.theme.palette.primary.light},
    '&:hover:not(.unfocus) > h3': {color: ui.theme.palette.primary.light}
  },
  title: {
    paddingBottom: '1vw',
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transitionProperty: 'color'
  }
};
