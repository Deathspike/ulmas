import LazyLoad from 'react-lazyload';
import * as React from 'react';

export function ImageView(props: {imageHeight: number, imageUrl?: string}) {
  return (
    <LazyLoad style={{...styles.imageContainer, height: `${props.imageHeight}vw`}} once resize>
      <img style={styles.image} src={props.imageUrl} onLoad={x => x.currentTarget.style.opacity = '1'} />
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
    transition: 'opacity 0.25s ease',
    width: '100%'
  }
};
