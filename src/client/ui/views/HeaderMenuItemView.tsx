import * as React from 'react';
import * as ui from 'client/ui';

export const HeaderMenuItemView = ui.createView<Props>(({ascending, disabled, onClick, selected, title, ...props}) => (
  <ui.material.MenuItem {...props} tabIndex={1}
    autoFocus={selected} selected={selected}
    disabled={disabled} onClick={onClick}>
    <ui.material.Typography>
      {title}
    </ui.material.Typography>
    {typeof ascending === 'boolean' && (ascending
      ? <ui.icons.ArrowDropUp sx={selected ? undefined : styles.hidden} />
      : <ui.icons.ArrowDropDown sx={selected ? undefined : styles.hidden} />)}
  </ui.material.MenuItem>
));

interface Props extends React.HTMLAttributes<HTMLLIElement> {
  ascending?: boolean;
  disabled?: boolean;
  onClick: () => void;
  selected: boolean;
  title: string;
}

const styles = {
  hidden: {
    visibility: 'hidden'
  }
};
