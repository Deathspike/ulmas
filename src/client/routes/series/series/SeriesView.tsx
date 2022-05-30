import * as app from '.';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';
import {language} from './language';

export function SeriesView(props: {vm: app.MainViewModel}) {
  return (
    <React.Fragment>
      {props.vm.seasons && <React.Fragment>
        <ui.material.Typography variant="h2" sx={styles.title}>
          {language.seasons}
        </ui.material.Typography>
        <ui.ImageLinkGridView imageHeight={23} columns={4} columnGap={2} rowGap={1}>
          {props.vm.seasons?.map(x => props.vm.series && (
            <ui.ImageLinkView key={x.season} title={x.title}
              imageHeight={23} imageUrl={core.image.series(props.vm.series, getSeasonPoster(x.season), 'poster')}
              onClick={() => props.vm.selectSeason(x)}>
              <ui.WatchView value={x.unwatchedCount} />
            </ui.ImageLinkView>
          ))}
        </ui.ImageLinkGridView>
      </React.Fragment>}
    </React.Fragment>
  );
}

function getSeasonPoster(season: number) {
  if (!season) return 'season-specials-poster';
  const id = String(season).padStart(2, '0');
  return `season${id}-poster`;
}

const styles = {
  title: {
    marginBottom: '0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
