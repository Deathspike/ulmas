import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const SeriesView = ui.createView<{vm: app.SeriesViewModel}>(props => (
  <ui.ImageLinkView title={props.vm.source.title} 
    imageHeight={21} imageUrl={props.vm.posterUrl}
    onClick={() => props.vm.open()}>
    <ui.WatchView value={props.vm.source.unwatchedCount ?? 0} />
  </ui.ImageLinkView>
));
