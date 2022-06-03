import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const MainView = ui.createView<{vm: app.MainViewModel}>(props => props.vm.title && (
  <ui.HeaderView title={props.vm.title} onBack={() => props.vm.onBackAsync()}>
    <ui.material.Typography>
      {props.vm.title}
    </ui.material.Typography>
  </ui.HeaderView>
));
