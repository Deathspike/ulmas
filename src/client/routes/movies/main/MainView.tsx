import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync(params: ui.RouteParams) {
    const vm = new app.MainViewModel(params.get('sectionId'));
    await vm.refreshAsync();
    return <MainView vm={vm} />;
  }

  render() {
    return (
      <ui.material.ThemeProvider theme={ui.theme}>
        <ui.material.CssBaseline />
        <ui.material.Grid>
          {this.props.vm.title}
        </ui.material.Grid>
        {this.props.vm.movies?.map(x =>
          <ui.material.Grid key={x.id}>
            <ReactLocation.Link to={x.url}>
              {x.title}
            </ReactLocation.Link>
          </ui.material.Grid>
        )}
      </ui.material.ThemeProvider>
    );
  }
}
