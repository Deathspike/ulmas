import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const SeriesView = ui.createView<{id: string, vm: app.SeriesViewModel}>(({id, vm}) => (
  <ui.ImageLinkView id={id} title={vm.source.title}
    imageHeight={21} imageUrl={vm.posterUrl}
    onClick={core.input.click(() => vm.open())}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}
    onMouseDown={core.input.mouseRestore()}>
    <ui.ImageLinkIconView onButton={core.input.click(() => vm.playAsync())}>
      <ui.icons.PlayArrow sx={styles.playIcon} />
    </ui.ImageLinkIconView>
    <ui.ImageProgressView value={vm.watchProgress} />
    <ui.ImageStatusView value={vm.source.unwatchedCount ?? 0} />
  </ui.ImageLinkView>
));

const styles = {
  playIcon: {
    fontSize: '3vw'
  }
};
