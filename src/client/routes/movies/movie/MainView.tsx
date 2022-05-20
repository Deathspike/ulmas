import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';
import {Container} from 'typedi';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync() {
    const vm = Container.get(app.MainViewModel);
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
        {this.props.vm.posterUrl
          ? <img src={this.props.vm.posterUrl} style={{maxWidth: 300}} />
          : undefined}
        <ui.material.Grid>
          <ReactLocation.Link to="watch">
            Watch Now
          </ReactLocation.Link>
        </ui.material.Grid>
      </ui.material.ThemeProvider>
    );
  }
}
