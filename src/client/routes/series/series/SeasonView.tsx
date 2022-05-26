import * as app from '.';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';

export function SeasonView(props: {vm: app.SeasonViewModel}) {
  const navigate = ReactLocation.useNavigate();
  return (
    <ui.ImageLinkView title={props.vm.title} 
      imageHeight={23} imageSrc={props.vm.posterSrc}
      onClick={() => navigate({to: props.vm.url})} />
  );
}
