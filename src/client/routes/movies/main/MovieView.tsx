import * as api from 'api';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';
import {core} from 'client/core';

export function MovieView(props: {vm: api.models.MovieEntry}) {
  const navigate = ReactLocation.useNavigate();
  return (
    <ui.ImageLinkView title={props.vm.title}
      imageHeight={21} imageUrl={core.image.movie(props.vm, 'poster')}
      onClick={() => navigate({to: props.vm.id})}>
      <ui.WatchView value={props.vm.watched ?? false} />
    </ui.ImageLinkView>
  );
}
