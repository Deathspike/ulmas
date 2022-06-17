import * as React from 'react';
import * as ui from 'client/ui';

export const ExclusiveView = ui.createView<Props>(({children, sx, ...props}) => (
  <ui.material.Box sx={sx ?? styles.rootContainer} {...props}
    onMouseEnter={x => onMouseEnter(x.currentTarget)}
    onMouseLeave={x => onMouseLeave(x.currentTarget)}>
    {children}
  </ui.material.Box>
));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  sx?: ui.material.SxProps<ui.material.Theme>;
}

function onMouseEnter(current: HTMLElement | null) {
  while (current) {
    if (current == document.body) break;
    current.classList.add('unfocus');
    current = current.parentElement;
  }
}

function onMouseLeave(current: HTMLElement | null) {
  while (current) {
    if (current == document.body) break;
    current.classList.remove('unfocus');
    current = current.parentElement;
  }
}

const styles = {
  rootContainer: {
    display: 'inline-block'
  }
};
