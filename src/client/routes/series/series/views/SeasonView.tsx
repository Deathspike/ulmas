import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const SeasonView = ui.createView<{vm: app.SeasonViewModel}>(({vm}) => (
  <ui.material.Grid>
    <ui.material.Typography variant="h2" sx={styles.title}>
      {vm.title}
    </ui.material.Typography>
    {vm.pages.map((x, i) => (
      <ui.LazyView key={i} style={{height: `${x.length * 21.50}vw`}}>
        {x.map(x => <app.EpisodeView key={x.source.id} vm={x} />)}
      </ui.LazyView>
    ))}
  </ui.material.Grid>
));

const styles = {
  title: {
    marginBottom: '0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
