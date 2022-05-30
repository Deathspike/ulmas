import * as React from 'react';
import * as ui from '..';

export function HeaderView(props: React.PropsWithChildren<{title?: string, onBack: () => void}>) {
  return (
    <React.Fragment>
      <ui.material.AppBar sx={styles.rootContainer}>
        <ui.material.Toolbar>
          <ui.material.IconButton sx={styles.toolBarButton} onClick={props.onBack}>
            <ui.icons.ArrowBackIos />
          </ui.material.IconButton>
          <ui.material.Grid sx={styles.titleContainer}>
            <ui.material.Typography sx={styles.title}>
              {props.title}
            </ui.material.Typography>
          </ui.material.Grid>
        </ui.material.Toolbar>
      </ui.material.AppBar>
      <ui.material.Grid sx={styles.children}>
        {props.children}
      </ui.material.Grid>
    </React.Fragment>
  );
}

const styles = {
  rootContainer: {
    color: ui.theme.palette.primary.contrastText
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
