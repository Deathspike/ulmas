import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const SeriesView = ui.createView<{vm: app.SeriesViewModel}>(({vm}) => (
  <ui.ImageLinkView title={vm.source.title} 
    imageHeight={21} imageUrl={vm.posterUrl}
    onClick={core.input.click(() => vm.open())}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}
    onMouseDown={x => x.preventDefault()}>
    <ui.ImageLinkIconView onButton={core.input.click(() => vm.playAsync())}>
      <ui.icons.PlayArrow sx={styles.playIcon} />
    </ui.ImageLinkIconView>
    <ui.WatchView value={vm.source.unwatchedCount ?? 0} />
  </ui.ImageLinkView>
));

const styles = {
  playIcon: {
    fontSize: '3vw'
  }
};
