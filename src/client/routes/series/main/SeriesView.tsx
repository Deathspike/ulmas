import * as app from '.';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';

export function SeriesView(props: {vm: app.SeriesViewModel}) {
  const navigate = ReactLocation.useNavigate();
  return (
    <ui.ImageLinkView height="20vw" onClick={() => navigate({to: props.vm.id})}
      imageUrl={props.vm.posterUrl}
      title={props.vm.title} />
  );
}
