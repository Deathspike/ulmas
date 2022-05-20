import * as app from '.';
import * as mobx from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouter from 'react-router-dom';

function App() {
  return (
    <ReactRouter.HashRouter>
      <ReactRouter.Switch>
        <ReactRouter.Route exact strict path="/" component={app.main.MainController} />
        <ReactRouter.Route exact strict path="/:sectionId/" component={app.section.SectionController} />
        <ReactRouter.Route exact strict path="/:sectionId/:seriesId/" component={app.series.SeriesController} />
        <ReactRouter.Redirect to="/web/" />
      </ReactRouter.Switch>
    </ReactRouter.HashRouter>
  )
}

(function() {
  const packageData = require('../../package');
  document.title = `${packageData.name} (${packageData.version})`;
  mobx.configure({enforceActions: 'never'});
  ReactDOM.render(<App />, document.getElementById('container'));
})();
