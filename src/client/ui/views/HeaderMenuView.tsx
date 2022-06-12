import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const HeaderMenuView = ui.createView<Props>(({children, icon, ...props}) => {
  const buttonReference = React.createRef<HTMLButtonElement>();
  const listReference = React.createRef<HTMLUListElement>();
  const [open, setOpen] = React.useState(false);
  return (
    <ui.material.Grid {...props}>
      <ui.material.IconButton ref={buttonReference} tabIndex={1}
        onClick={() => setOpen(true)}
        onKeyDown={core.input.keyRestore()}>
        {icon}
      </ui.material.IconButton>
      {open && <ui.material.ClickAwayListener onClickAway={() => setOpen(false)}>
        <ui.material.Paper sx={styles.rootContainer} square={true}>
          <ui.material.List ref={listReference}
            onBlur={() => onBlur(listReference.current, () => setOpen(false))}
            onKeyDown={x => onKeyDown(x, buttonReference.current)}>
            {children}
          </ui.material.List>
        </ui.material.Paper>
      </ui.material.ClickAwayListener>}
    </ui.material.Grid>
  );
});

function onBlur(element: HTMLUListElement | null, onClose: () => void) {
  requestAnimationFrame(() => {
    if (element?.contains(document.activeElement)) return;
    onClose();
  });
}

function onKeyDown(ev: React.KeyboardEvent, button: HTMLButtonElement | null) {
  if (ev.code.toLowerCase() === 'escape' && !core.screen.waitCount) {
    button?.focus();
    ev.preventDefault();
    ev.stopPropagation();
  } else {
    const restore = core.input.keyRestore();
    restore(ev);
  }
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  icon: JSX.Element;
}

const styles = {
  rootContainer: {
    position: 'fixed',
    right: 0,
    top: '3.5vw'
  }
};
