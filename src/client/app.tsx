import 'reflect-metadata';
import * as mobx from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactLocation from '@tanstack/react-location';
import * as routes from './routes';
import * as ui from './ui';

function App() {
  return (
    <ui.material.ThemeProvider theme={ui.theme}>
      <ui.material.CssBaseline />
      <Router />
    </ui.material.ThemeProvider>
  );
}

function Router() {
  const history = ReactLocation.createHashHistory();
  const location = new ReactLocation.ReactLocation({history});
  return <ReactLocation.Router location={location} routes={routes.Router()} />;
}

(function() {
  const packageData = require('../../package');
  document.title = `${packageData.name} (${packageData.version})`;
  mobx.configure({enforceActions: 'never'});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
