import LazyLoad from 'react-lazyload';
import * as React from 'react';

export function ImageView(props: {imageHeight: number, imageSrc?: HTMLImageElement | string}) {
  return (
    <LazyLoad style={{...styles.imageContainer, height: `${props.imageHeight}vw`}} once resize>
      {props.imageSrc && typeof props.imageSrc === 'string' && <img
        onLoad={x => x.currentTarget.style.opacity = '1'}
        src={props.imageSrc}
        style={styles.image} />}
      {props.imageSrc && typeof props.imageSrc === 'object' && <div ref={x => {
        if (typeof props.imageSrc !== 'object') throw new Error();
        props.imageSrc.style.objectFit = String(styles.image.objectFit);
        props.imageSrc.style.height = styles.image.height;
        props.imageSrc.style.width = styles.image.width;
        x?.parentNode?.replaceChild(props.imageSrc, x);
      }} />}
    </LazyLoad>
  );
}

const styles = {
  imageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  image: {
    objectFit: 'cover' as React.CSSProperties['objectFit'],
    opacity: 0,
    height: '100%',
    transition: 'opacity 0.5s ease',
    width: '100%'
  }
};
