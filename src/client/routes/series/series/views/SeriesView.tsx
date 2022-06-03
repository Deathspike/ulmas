import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';

export const SeriesView = ui.createView<{vm: app.MainViewModel}>(props => props.vm.seasons && (
  <ui.material.Grid>
    <ui.material.Typography variant="h2" sx={styles.title}>
      {app.language.seasons}
    </ui.material.Typography>
    <ui.ImageLinkGridView imageHeight={23} columns={4} columnGap={2} rowGap={1}>
      {props.vm.seasons?.map(x => <ui.ImageLinkView key={x.season} title={x.title}
        imageHeight={23} imageUrl={props.vm.posterUrl}
        onClick={ui.click(() => props.vm.selectSeason(x))}>
        <ui.ImageLinkIconView
          icon={<ui.icons.PlayArrow sx={styles.playIcon} />}
          onClick={ui.click(() => props.vm.playSeasonAsync(x))} />
        <ui.WatchView value={x.unwatchedCount} />
      </ui.ImageLinkView>)}
    </ui.ImageLinkGridView>
  </ui.material.Grid>
));

const styles = {
  title: {
    marginBottom: '0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  playIcon: {
    fontSize: '3vw'
  }
};
