import LazyLoad from 'react-lazyload';
import * as React from 'react';
import * as ui from 'client/ui';

export const ImageLinkGridView = ui.createView<{imageHeight: number, columns: number, columnGap: number, rowGap: number}>(props => {
  const gridGap = styles.page.gridGap
    .replace('{columnGap}', String(props.columnGap))
    .replace('{rowGap}', String(props.rowGap));
  const gridTemplateColumns = styles.page.gridTemplateColumns
    .replace('{columns}', String(props.columns))
    .replace('{totalColumnGap}', String((props.columns - 1) * props.columnGap));
  return (
    <LazyLoad style={{height: `${calculateHeight(props)}vw`}} once resize unmountIfInvisible>
      <ui.material.Grid sx={{...styles.page, gridGap, gridTemplateColumns}}>
        {props.children}
      </ui.material.Grid>
    </LazyLoad>
  );
});

function calculateHeight(props: React.PropsWithChildren<{imageHeight: number, columns: number, rowGap: number}>) {
  const childCount = Array.isArray(props.children) ? props.children.length : 0;
  const rowCount = Math.ceil(childCount / props.columns);
  return rowCount * (props.imageHeight + props.rowGap + 2.25);
}

const styles = {
  page: {
    display: 'grid',
    gridGap: '{rowGap}vw {columnGap}vw',
    gridTemplateColumns: 'repeat(auto-fill, calc((100% - {totalColumnGap}vw) / {columns}))',
    justifyContent: 'center',
    width: '100%'
  }
};
