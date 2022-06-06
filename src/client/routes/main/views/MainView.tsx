import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
  <ui.HeaderView title={app.language.title} onButton={core.input.click(() => core.screen.backAsync())}>
    {vm.sections?.map(x => <app.SectionView key={x.source.id} vm={x} />)}
  </ui.HeaderView>
));
