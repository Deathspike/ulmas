import * as React from 'react';
import * as ui from 'client/ui';

export function ImageLinkView(props: React.PropsWithChildren<{imageHeight: number, imageUrl?: string, title: string, onClick: () => void}>) {
  return (
    <ui.material.Grid sx={styles.rootContainer} onClick={props.onClick}>
      <ui.material.Grid sx={styles.imageContainer}>
        <ui.ImageView imageHeight={props.imageHeight} imageUrl={props.imageUrl}>
          {props.children}
        </ui.ImageView>
      </ui.material.Grid>
      <ui.material.Typography sx={styles.title}>
        {props.title}
      </ui.material.Typography>
    </ui.material.Grid>
  );
}

const styles = {
  rootContainer: {
    cursor: 'pointer',
    '&:hover > *': {borderColor: ui.theme.palette.primary.main}
  },
  imageContainer: {
    border: '0.25vw solid transparent'
  },
  title: {
    height: '1.75vw',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
