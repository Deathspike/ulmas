import * as React from 'react';
import * as ui from 'client/ui';

export const ImageLinkView = ui.createView<Props>(({children, imageHeight, imageUrl, title, ...props}) => (
  <ui.material.Grid sx={styles.rootContainer} tabIndex={0} {...props}>
    <ui.material.Grid sx={styles.imageContainer}>
      <ui.ImageView imageHeight={imageHeight} imageUrl={imageUrl}>
        {children}
      </ui.ImageView>
    </ui.material.Grid>
    <ui.material.Typography sx={styles.title}>
      {title}
    </ui.material.Typography>
  </ui.material.Grid>
));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  imageHeight: number;
  imageUrl?: string;
  title: string;
}

const styles = {
  rootContainer: {
    cursor: 'pointer',
    '&:focus > *': {borderColor: ui.theme.palette.primary.light},
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
