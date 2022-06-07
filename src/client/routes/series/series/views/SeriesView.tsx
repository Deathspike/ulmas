import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const SeriesView = ui.createView<{vm: app.MainViewModel}>(({vm}) => vm.seasons && (
  <ui.material.Grid>
    <ui.material.Typography variant="h2" sx={styles.title}>
      {app.language.seasons}
    </ui.material.Typography>
    <ui.ImageLinkGridView imageHeight={23} columns={4} columnGap={2} rowGap={1}>
      {vm.seasons?.map(x => (
        <ui.ImageLinkView key={x.season} title={x.title}
          imageHeight={23} imageUrl={x.posterUrl}
          onClick={core.input.click(() => x.open())}
          onKeyDown={core.input.keyDown(k => x.handleKey(k))}
          onMouseDown={x => x.preventDefault()}>
          <ui.ImageLinkIconView onButton={core.input.click(() => x.playAsync())}>
            <ui.icons.PlayArrow sx={styles.playIcon} />
          </ui.ImageLinkIconView>
          <ui.WatchView value={x.unwatchedCount} />
        </ui.ImageLinkView>
      ))}
    </ui.ImageLinkGridView>
  </ui.material.Grid>
));

const styles = {
  title: {
    marginBottom: '0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  playIcon: {
    fontSize: '3vw'
  }
};
