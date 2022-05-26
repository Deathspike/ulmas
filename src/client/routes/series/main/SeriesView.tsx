import * as app from '.';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';

export function SeriesView(props: {vm: app.SeriesViewModel}) {
  const navigate = ReactLocation.useNavigate();
  return (
    <ui.ImageLinkView title={props.vm.title} 
      imageHeight={21} imageSrc={props.vm.posterSrc}
      onClick={() => navigate({to: props.vm.id})}>
      <ui.WatchView value={props.vm.unwatchedCount} />
    </ui.ImageLinkView>
  );
}
