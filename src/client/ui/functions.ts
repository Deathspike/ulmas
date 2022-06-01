import * as mobxReact from 'mobx-react';
import * as React from 'react';

export function *createPages<T>(maxPerPage: number, items: Array<T>) {
  for (let i = 0; i < items.length; i += maxPerPage) {
    yield items.slice(i, i + maxPerPage);
  }
}

export function createView<T>(fn: (props: React.PropsWithChildren<T>) => '' | JSX.Element | undefined) {
  return mobxReact.observer((props: React.PropsWithChildren<T>) => {
    return fn(props) || null;
  });
}
