import LazyLoad from 'react-lazyload';
import * as React from 'react';
import * as ui from 'client/ui';

export function ImageLinkGridView(props: React.PropsWithChildren<{columns: number, gapSize: number, imageHeight: number, titleHeight: number}>) {
  const gridGap = styles.page.gridGap
    .replace('{gapSize}', String(props.gapSize));
  const gridTemplateColumns = styles.page.gridTemplateColumns
    .replace('{columns}', String(props.columns))
    .replace('{totalGapSize}', String((props.columns - 1) * props.gapSize));
  return (
    <LazyLoad style={{height: `${calculateHeight(props)}vw`}} once resize unmountIfInvisible>
      <ui.material.Grid sx={{...styles.page, gridGap, gridTemplateColumns}}>
        {props.children}
      </ui.material.Grid>
    </LazyLoad>
  );
}

function calculateHeight(props: React.PropsWithChildren<{columns: number, imageHeight: number, titleHeight: number}>) {
  const childCount = Array.isArray(props.children) ? props.children.length : 0;
  const rowCount = Math.ceil(childCount / props.columns);
  return rowCount * (props.imageHeight + props.titleHeight + 0.5);
}

const styles = {
  page: {
    display: 'grid',
    gridGap: '0 {gapSize}vw',
    gridTemplateColumns: 'repeat(auto-fill, calc((100% - {totalGapSize}vw) / {columns}))',
    justifyContent: 'center',
    width: '100%'
  }
};
