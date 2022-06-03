import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const SeriesView = ui.createView<{vm: app.SeriesViewModel}>(props => (
  <ui.ImageLinkView title={props.vm.source.title} 
    imageHeight={21} imageUrl={props.vm.posterUrl}
    onClick={() => props.vm.open()}>
    <ui.ImageLinkIconView
      icon={<ui.icons.PlayArrow sx={styles.playIcon} />}
      onClick={() => props.vm.playAsync()} />
    <ui.WatchView value={props.vm.source.unwatchedCount ?? 0} />
  </ui.ImageLinkView>
));

const styles = {
  playIcon: {
    fontSize: '3vw'
  }
};
