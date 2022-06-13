import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MovieView = ui.createView<{vm: app.MovieViewModel}>(({vm}) => (
  <ui.ImageLinkView id={`movie-${vm.source.id}`} title={vm.source.title}
    imageHeight={21} imageUrl={vm.posterUrl}
    onClick={core.input.click(() => vm.open())}
    onKeyDown={core.input.keyDown(k => vm.handleKey(k))}
    onMouseDown={core.input.mouseRestore()}>
    <ui.ImageLinkIconView onButton={core.input.click(() => vm.playAsync())}>
      <ui.icons.PlayArrow sx={styles.playIcon} />
    </ui.ImageLinkIconView>
    <ui.WatchView value={vm.source.watched ?? false} />
  </ui.ImageLinkView>
));

const styles = {
  playIcon: {
    fontSize: '3vw'
  }
};
