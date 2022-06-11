import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const HeaderView = ui.createView<Props>(({additionalContent, children, onButton, title, ...props}) => (
  <ui.material.Grid ref={x => x && onReference(x)} {...props}>
    <ui.material.AppBar sx={styles.rootContainer}>
      <ui.material.Toolbar>
        <ui.material.IconButton sx={styles.toolBarButton} tabIndex={1}
          onClick={onButton}
          onKeyDown={core.input.keyRestore()}>
          <ui.icons.ArrowBackIos />
        </ui.material.IconButton>
        <ui.material.Grid sx={styles.titleContainer}>
          <ui.material.Typography sx={styles.title}>
            {title}
          </ui.material.Typography>
        </ui.material.Grid>
        <ui.material.Grid sx={styles.contentContainer}>
          {additionalContent}
        </ui.material.Grid>
      </ui.material.Toolbar>
    </ui.material.AppBar>
    <ui.material.Grid sx={styles.children}>
      {children}
    </ui.material.Grid>
  </ui.material.Grid>
));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  additionalContent?: JSX.Element;
  onButton: (ev: React.MouseEvent) => void;
  title: string;
}

function onReference(element: HTMLElement) {
  if (document.activeElement && document.activeElement !== document.body) return;
  element?.focus({preventScroll: true});
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
  contentContainer: {
    height: '3.5vw',
    lineHeight: '3.5vw'
  },
  children: {
    minHeight: '100vh',
    paddingTop: '3.5vw'
  }
};
