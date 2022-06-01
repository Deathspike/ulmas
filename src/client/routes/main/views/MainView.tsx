import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(props => (
  <ui.HeaderView title={app.language.title} onBack={() => core.screen.backAsync()}>
    {props.vm.sections?.map(x => <app.SectionView key={x.source.id} vm={x} />)}
  </ui.HeaderView>
));
