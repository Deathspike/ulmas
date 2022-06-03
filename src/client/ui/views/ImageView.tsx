import LazyLoad from 'react-lazyload';
import * as React from 'react';
import * as ui from 'client/ui';
const attributeName = 'data-src';

export const ImageView = ui.createView<{imageHeight: number, imageUrl?: string}>(props => (
  <LazyLoad style={{...styles.imageContainer, height: `${props.imageHeight}vw`}} once resize>
    {props.imageUrl && <img ref={x => x && onRender(x, props.imageUrl)}
      onLoad={x => x.currentTarget.style.opacity = '1'}
      style={styles.image} />}
    {props.children}
  </LazyLoad>
));

function onRender(image: HTMLImageElement, imageUrl = '') {
  if (image.src && image.src !== imageUrl) {
    setTimeout(() => onTimeout(image, imageUrl), 225);
    image.setAttribute(attributeName, imageUrl);
    image.style.opacity = '0';
  } else {
    image.src = imageUrl;
  }
}

function onTimeout(image: HTMLImageElement, imageUrl: string) {
  if (image.getAttribute(attributeName) !== imageUrl) return;
  image.removeAttribute(attributeName);
  image.src = imageUrl;
}

const styles = {
  imageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative' as React.CSSProperties['position']
  },
  image: {
    objectFit: 'cover' as React.CSSProperties['objectFit'],
    opacity: 0,
    height: '100%',
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    width: '100%'
  }
};
