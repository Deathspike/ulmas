import LazyLoad from 'react-lazyload';
import * as React from 'react';
const attributeName = 'data-src';

export function ImageView(props: React.PropsWithChildren<{imageHeight: number, imageUrl?: string}>) {
  return (
    <LazyLoad style={{...styles.imageContainer, height: `${props.imageHeight}vw`}} once resize>
      {props.imageUrl && <img ref={x => x && onRender(x, props.imageUrl)}
        onLoad={x => x.currentTarget.style.opacity = '1'}
        style={styles.image} />}
      {props.children}
    </LazyLoad>
  );
}

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
    transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    width: '100%'
  }
};
