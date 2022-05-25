import * as app from '.';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';

export function MovieView(props: {vm: app.MovieViewModel}) {
  const navigate = ReactLocation.useNavigate();
  return (
    <ui.ImageLinkView imageHeight={21} titleHeight={3}
      imageSrc={props.vm.posterSrc}
      title={props.vm.title} 
      onClick={() => navigate({to: props.vm.id})} />
  );
}
