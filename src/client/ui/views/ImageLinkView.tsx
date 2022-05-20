import * as React from 'react';
import * as ui from 'client/ui';

export function ImageLinkView(props: {height: string, imageUrl?: string, title: string, onClick: () => void}) {
  return (
    <ui.material.Grid sx={styles.sourceContainer} onClick={props.onClick}>
      <ui.material.Grid sx={styles.paddingContainer} style={{height: props.height}}>
        <ui.material.Grid sx={styles.borderContainer}>
          <ui.ImageView imageUrl={props.imageUrl} />
        </ui.material.Grid>
      </ui.material.Grid>
      <ui.material.Typography sx={styles.title}>
        {props.title}
      </ui.material.Typography>
    </ui.material.Grid>
  );
}

const styles = {
  sourceContainer: {
    cursor: 'pointer',
    '&:hover > *': {padding: 0},
    '&:hover > * > *': {borderColor: 'primary.main'}
  },
  paddingContainer: {
    padding: ui.sz(4),
    transition: 'padding 0.25s ease',
  },
  borderContainer: {
    border: `${ui.sz(2)} solid transparent`,
    borderRadius: ui.sz(14),
    height: '100%'
  },
  title: {
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
