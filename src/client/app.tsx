import 'reflect-metadata';
import * as mobx from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as routes from 'client/routes';
import * as ui from 'client/ui';
import {ScreenView} from './core';
const packageData = require('../../package');

function App() {
  return (
    <ui.material.ThemeProvider theme={ui.theme}>
      <ui.material.CssBaseline />
      <ScreenView />
    </ui.material.ThemeProvider>
  );
}

(function() {
  document.title = `${packageData.name} (${packageData.version})`;
  mobx.configure({enforceActions: 'never'});
  ReactDOM.render(<App />, document.getElementById('container'));
  routes.main();
})();
