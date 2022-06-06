import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => vm.title && (
  <ui.HeaderView title={vm.title} onButton={core.input.click(() => vm.onBackAsync())}>
    <ui.material.Typography>
      {vm.title}
    </ui.material.Typography>
  </ui.HeaderView>
));
