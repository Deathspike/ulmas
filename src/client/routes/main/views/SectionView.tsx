import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const SectionView = ui.createView<{vm: app.SectionViewModel}>(props => (
  <ui.material.Typography key={props.vm.source.id} onClick={() => props.vm.open()}>
    {props.vm.source.title}
  </ui.material.Typography>
));
