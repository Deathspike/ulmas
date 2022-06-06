import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MovieView = ui.createView<{vm: app.MovieViewModel}>(({vm}) => (
  <ui.ImageLinkView title={vm.source.title}
    imageHeight={21} imageUrl={vm.posterUrl}
    onClick={core.input.click(() => vm.open())}>
    <ui.WatchView value={vm.source.watched ?? false} />
  </ui.ImageLinkView>
));
