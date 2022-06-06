import * as mobxReact from 'mobx-react';

export function autoFocus() {
  const attributeName = 'data-focus';
  return (element: HTMLElement | null) => {
    if (!element || (document.activeElement && document.activeElement !== document.body)) return;
    element.setAttribute(attributeName, '');
    element.focus();
  };
}

export function *createPages<T>(maxPerPage: number, items: Array<T>) {
  for (let i = 0; i < items.length; i += maxPerPage) {
    yield items.slice(i, i + maxPerPage);
  }
}

export function createView<T>(fn: (props: T) => '' | JSX.Element | undefined) {
  return mobxReact.observer((props: T) => {
    return fn(props) || null;
  });
}
