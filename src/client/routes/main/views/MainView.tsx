import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';
import {observer} from 'mobx-react';

export const MainView = observer(function (props: {vm: app.MainViewModel}) {
  return (
    <ui.HeaderView title={app.language.title} onBack={() => core.screen.backAsync()}>
      {props.vm.sections?.map(x => <app.SectionView key={x.source.id} vm={x} />)}
    </ui.HeaderView>
  );
});
