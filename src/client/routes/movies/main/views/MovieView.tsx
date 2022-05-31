import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export function MovieView(props: {vm: app.MovieViewModel}) {
  return (
    <ui.ImageLinkView title={props.vm.source.title}
      imageHeight={21} imageUrl={props.vm.posterUrl}
      onClick={() => props.vm.open()}>
      <ui.WatchView value={props.vm.source.watched ?? false} />
    </ui.ImageLinkView>
  );
}
