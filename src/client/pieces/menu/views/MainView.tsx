import * as app from '..';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const MainView = ui.createView<{vm: app.MainViewModel}>(({vm}) => (
  <ui.material.Grid sx={styles.rootContainer}>
    <app.SearchView vm={vm.search} />
    <ui.HeaderMenuView icon={<ui.icons.SortByAlpha />}>
      <ui.HeaderMenuItemView
        ascending={vm.ascending}
        onClick={() => vm.changeSort('title')}
        selected={vm.sort.value === 'title'}
        title={app.language.sortTitle} />
      <ui.HeaderMenuItemView
        ascending={vm.ascending}
        onClick={() => vm.changeSort('dateAdded')}
        selected={vm.sort.value === 'dateAdded'}
        title={app.language.sortDateAdded} />
      <ui.HeaderMenuItemView
        ascending={vm.ascending}
        onClick={() => vm.changeSort('lastPlayed')}
        selected={vm.sort.value === 'lastPlayed'}
        title={app.language.sortLastPlayed} />
      <ui.HeaderMenuItemView disabled
        ascending={vm.ascending}
        onClick={() => vm.changeSort('premieredDate')}
        selected={vm.sort.value === 'premieredDate'}
        title={app.language.sortPremieredDate} />
    </ui.HeaderMenuView>
    <ui.HeaderMenuView icon={<ui.icons.FilterList />}>
      <ui.HeaderMenuItemView
        onClick={() => vm.changeFilter('all')}
        selected={vm.filter.value === 'all'}
        title={app.language.filterAll} />
      <ui.HeaderMenuItemView
        onClick={() => vm.changeFilter('ended')}
        selected={vm.filter.value === 'ended'}
        title={app.language.filterEnded} />
      <ui.HeaderMenuItemView
        onClick={() => vm.changeFilter('ongoing')}
        selected={vm.filter.value === 'ongoing'}
        title={app.language.filterOngoing} />
      <ui.HeaderMenuItemView
        onClick={() => vm.changeFilter('unseen')}
        selected={vm.filter.value === 'unseen'}
        title={app.language.filterUnseen} />
    </ui.HeaderMenuView>
    <ui.material.Grid>
      <ui.material.IconButton tabIndex={1}
        onClick={() => vm.refreshAsync()}
        onKeyDown={core.input.keyRestore()}>
        <ui.icons.Refresh />
      </ui.material.IconButton>
    </ui.material.Grid>
  </ui.material.Grid>
));

const styles = {
  rootContainer: {
    display: 'flex',
    marginRight: '0.25vw'
  }
};
