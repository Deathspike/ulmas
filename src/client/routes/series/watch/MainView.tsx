import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ui from '@/ui';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync(params: ui.RouteParams) {
    const vm = new app.MainViewModel(params.get('sectionId'), params.get('seriesId'), params.get('episodeId'));
    await vm.refreshAsync();
    return <MainView vm={vm} />;
  }

  componentDidMount() {
    this.props.vm.componentDidMount();
  }

  render() {
    return (
      <ui.material.ThemeProvider theme={ui.theme}>
        <ui.material.CssBaseline />
        {this.props.vm.title}
      </ui.material.ThemeProvider>
    );
  }
}
