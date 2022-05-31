import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export function SeriesView(props: {vm: app.SeriesViewModel}) {
  return (
    <ui.ImageLinkView title={props.vm.source.title} 
      imageHeight={21} imageUrl={props.vm.posterUrl}
      onClick={() => props.vm.open()}>
      <ui.WatchView value={props.vm.source.unwatchedCount ?? 0} />
    </ui.ImageLinkView>
  );
}
