import * as app from '.';
import * as mobxReact from 'mobx-react';
import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as ui from 'client/ui';
import {Container} from 'typedi';
import {language} from './language';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  static async createAsync() {
    const vm = Container.get(app.MainViewModel);
    await vm.refreshAsync();
    return <MainView vm={vm} />;
  }

  render() {
    return (
      <ui.HeaderView title={language.title}>
        {this.props.vm.sections?.map(x =>
          <ui.material.Typography key={x.id}>
            <ReactLocation.Link to={x.url}>
              {x.title}
            </ReactLocation.Link>
          </ui.material.Typography>
        )}
      </ui.HeaderView>
    );
  }
}
