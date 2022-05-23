import * as app from '.';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';

export function SeasonView(props: {vm: app.SeasonViewModel}) {
  const navigate = ReactLocation.useNavigate();
  return (
    <ui.ImageLinkView imageHeight={19} titleHeight={2}
      imageUrl={props.vm.posterUrl}
      title={props.vm.title} 
      onClick={() => navigate({to: props.vm.url})} />
  );
}
