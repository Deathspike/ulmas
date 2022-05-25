import * as React from 'react';
import * as ui from 'client/ui';

export function ImageLinkView(props: {imageHeight: number, imageSrc?: HTMLImageElement | string, title: string, titleHeight: number, onClick: () => void}) {
  return (
    <ui.material.Grid sx={styles.rootContainer} onClick={props.onClick}>
      <ui.material.Grid sx={styles.imageContainer}>
        <ui.ImageView imageHeight={props.imageHeight} imageSrc={props.imageSrc} />
      </ui.material.Grid>
      <ui.material.Typography sx={styles.title} style={{height: `${props.titleHeight}vw`}}>
        {props.title}
      </ui.material.Typography>
    </ui.material.Grid>
  );
}

const styles = {
  rootContainer: {
    cursor: 'pointer',
    '&:hover > *': {borderColor: 'primary.main'}
  },
  imageContainer: {
    border: '0.25vw solid transparent'
  },
  title: {
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
