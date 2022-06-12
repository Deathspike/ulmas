import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const SectionView = ui.createView<{vm: app.SectionViewModel}>(({vm}) => (
  <ui.material.Typography key={vm.source.id} 
    onClick={core.input.click(() => vm.open())}
    onMouseDown={core.input.mouseRestore()}>
    {vm.source.title}
  </ui.material.Typography>
));
