import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {observer} from 'mobx-react';

export const MainView = observer(function (props: {vm: app.MainViewModel}) {
  return (
    <ui.HeaderView title={props.vm.title} onBack={() => props.vm.onBack()}>
      <ui.material.Typography>
        {props.vm.title}
      </ui.material.Typography>
    </ui.HeaderView>
  );
});
