import LazyLoad from 'react-lazyload';
import * as React from 'react';
import * as ui from 'client/ui';

export const ImageLinkGridView = ui.createView<Props>(({children, columns, columnGap, imageHeight, rowGap, ...props}) => {
  const count = Array.isArray(children)
    ? children.length
    : 0;
  const gridGap = styles.page.gridGap
    .replace('{columnGap}', String(columnGap))
    .replace('{rowGap}', String(rowGap));
  const gridTemplateColumns = styles.page.gridTemplateColumns
    .replace('{columns}', String(columns))
    .replace('{totalColumnGap}', String((columns - 1) * columnGap));
  return (
    <LazyLoad style={{height: `${Math.ceil(count / columns) * (imageHeight + rowGap + 2.25)}vw`}} once resize unmountIfInvisible>
      <ui.material.Grid sx={{...styles.page, gridGap, gridTemplateColumns}} {...props}>
        {children}
      </ui.material.Grid>
    </LazyLoad>
  );
});

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  imageHeight: number;
  columns: number;
  columnGap: number;
  rowGap: number;
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
