import * as mui from '@mui/material';
import * as React from 'react';
import * as ui from '..';

export function HeaderView(props: React.PropsWithChildren<{title?: string}>) {
  return (
    <mui.Grid>
      <mui.AppBar>
        <mui.Toolbar>
          <mui.IconButton sx={styles.toolBarButton} onClick={() => history.back()}>
            <ui.icons.ArrowBackIos />
          </mui.IconButton>
          <mui.Grid sx={styles.titleContainer}>
            <mui.Typography sx={styles.title}>
              {props.title}
            </mui.Typography>
          </mui.Grid>
        </mui.Toolbar>
      </mui.AppBar>
      {props.children && <mui.Grid sx={styles.children}>
        {props.children}
      </mui.Grid>}
    </mui.Grid>
  );
}

const styles = {
  toolBarButton: {
    color: 'primary.contrastText',
    marginRight: ui.sz(2),
    paddingLeft: ui.sz(12),
    paddingRight: ui.sz(5)
  },
  titleContainer: {
    flex: 1,
    width: 0
  },
  title: {
    color: 'primary.contrastText',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  children: {
    paddingTop: ui.sz(32)
  }
};
