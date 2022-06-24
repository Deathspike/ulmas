import * as mobxReact from 'mobx-react';
import {forceCheck} from 'react-lazyload';
let raf: number | undefined;

export function *createPages<T>(maxPerPage: number, items: Array<T>) {
  for (let i = 0; i < items.length; i += maxPerPage) {
    yield items.slice(i, i + maxPerPage);
  }
}

export function createView<T>(fn: (props: T) => any) {
  return mobxReact.observer((props: T) => {
    const element = fn(props);
    requestForceCheck();
    return element || null;
  });
}

function requestForceCheck() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    forceCheck();
    raf = undefined;
  });
}
