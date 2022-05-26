import * as mui from '@mui/material';
import * as React from 'react';
import * as ui from '..';

export function HeaderView(props: React.PropsWithChildren<{title?: string}>) {
  return (
    <React.Fragment>
      <mui.AppBar sx={styles.rootContainer}>
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
      <mui.Grid sx={styles.children}>
        {props.children}
      </mui.Grid>
    </React.Fragment>
  );
}

const styles = {
  rootContainer: {
    color: 'primary.contrastText'
  },
  toolBarButton: {
    marginLeft: '0.25vw',
    marginRight: '0.25vw',
    padding: '0.5vw 0.25vw 0.5vw 1vw',
  },
  titleContainer: {
    flex: 1,
    minWidth: 0
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  children: {
    paddingTop: '3.5vw'
  }
};
