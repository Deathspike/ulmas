import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(props => props.vm.title && (
  <ui.HeaderView title={props.vm.title} onBack={() => core.screen.backAsync()}>
    <ui.material.Grid sx={styles.seriesContainer}>
      {props.vm.pages?.map((x, i) => <ui.ImageLinkGridView key={i} imageHeight={21} columns={6} columnGap={2} rowGap={1}>
        {x.map(x => <app.SeriesView key={x.source.id} vm={x} />)}
      </ui.ImageLinkGridView>)}
    </ui.material.Grid>
  </ui.HeaderView>
));

const styles = {
  seriesContainer: {
    padding: '1.5vw'
  }
};
