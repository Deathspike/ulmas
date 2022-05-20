import LazyLoad from 'react-lazyload';
import * as React from 'react';
import * as ui from 'client/ui';

export function ImageView(props: {imageUrl?: string}) {
  return (
    <LazyLoad style={styles.imageContainer} once resize>
      <img style={styles.image} src={props.imageUrl} onLoad={x => x.currentTarget.style.opacity = '1'} />
    </LazyLoad>
  );
}

const styles = {
  imageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: ui.sz(12),
    height: '100%',
    position: 'relative' as React.CSSProperties['position']
  },
  image: {
    borderRadius: ui.sz(12),
    objectFit: 'cover' as React.CSSProperties['objectFit'],
    opacity: 0,
    height: '100%',
    transition: 'opacity 0.25s ease',
    width: '100%'
  }
};
