import * as React from 'react';
import * as ui from 'client/ui';
import LazyLoad from 'react-lazyload';

export const LazyView = ui.createView<React.HTMLAttributes<HTMLLIElement>>(({children, ...props}) => {
  const [, updateState] = React.useState<Object>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  React.useEffect(() => {
    window.addEventListener('resize', forceUpdate);
    return () => window.removeEventListener('resize', forceUpdate);
  });
  return (
    <LazyLoad offset={window.innerHeight} resize unmountIfInvisible {...props}>
      {children}
    </LazyLoad>
  );
});
