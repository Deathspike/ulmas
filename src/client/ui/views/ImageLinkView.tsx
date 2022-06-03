import * as React from 'react';
import * as ui from 'client/ui';

export const ImageLinkView = ui.createView<{imageHeight: number, imageUrl?: string, title: string, onClick: () => void}>(props => (
  <ui.material.Grid sx={styles.rootContainer} onClick={ui.click(props.onClick)}>
    <ui.material.Grid sx={styles.imageContainer}>
      <ui.ImageView imageHeight={props.imageHeight} imageUrl={props.imageUrl}>
        {props.children}
      </ui.ImageView>
    </ui.material.Grid>
    <ui.material.Typography sx={styles.title}>
      {props.title}
    </ui.material.Typography>
  </ui.material.Grid>
));

const styles = {
  rootContainer: {
    cursor: 'pointer',
    '&:hover > *': {borderColor: ui.theme.palette.primary.main}
  },
  imageContainer: {
    border: '0.25vw solid transparent',
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
  },
  title: {
    height: '1.75vw',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
