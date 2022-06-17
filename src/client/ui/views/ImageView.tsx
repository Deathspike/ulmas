import LazyLoad from 'react-lazyload';
import * as React from 'react';
import * as ui from 'client/ui';

export const ImageView = ui.createView<Props>(({children, imageHeight, imageUrl, ...props}) => (
  <LazyLoad style={{...styles.imageContainer, height: `${imageHeight}vw`}} once resize>
    {imageUrl && <img {...props}
      ref={x => x && onReference(x, imageUrl)}
      onLoad={x => x.currentTarget.style.opacity = '1'}
      style={styles.image} />}
    {children}
  </LazyLoad>
));

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  imageHeight: number;
  imageUrl?: string;
}

function onReference(element: HTMLImageElement, imageUrl = '') {
  if (!element.src || element.src === imageUrl) {
    element.src = imageUrl;
  } else {
    const attributeName = 'data-src';
    element.setAttribute(attributeName, imageUrl);
    element.style.opacity = '0';
    setTimeout(() => {
      if (element.getAttribute(attributeName) !== imageUrl) return;
      element.removeAttribute(attributeName);
      element.src = imageUrl
    }, 225);
  }
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
    transitionProperty: 'opacity',
    width: '100%'
  }
};
